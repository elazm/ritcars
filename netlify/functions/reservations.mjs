import { z } from "zod";
import twilio from "twilio";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const rateLimitStore = new Map();

function readPositiveIntEnv(name, fallback) {
  const value = Number.parseInt(process.env[name] || "", 10);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";

  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("client-ip") ||
    forwardedFor.split(",")[0]?.trim() ||
    "unknown"
  );
}

function checkRateLimit(request, { prefix, max, windowMs }) {
  const now = Date.now();
  const key = `${prefix}:${getClientIp(request)}`;
  const bucket = rateLimitStore.get(key);

  if (rateLimitStore.size > 1000) {
    for (const [storedKey, storedBucket] of rateLimitStore.entries()) {
      if (storedBucket.resetAt <= now) {
        rateLimitStore.delete(storedKey);
      }
    }
  }

  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }

  bucket.count += 1;

  if (bucket.count > max) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }

  return { limited: false, retryAfter: 0 };
}

function isValidIsoDate(value) {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function todayIsoDate() {
  return new Date().toISOString().slice(0, 10);
}

const reservationSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{8,20}$/, "Numero de telephone invalide"),
    email: z.string().trim().email().max(254).optional().or(z.literal("")),
    car: z.string().trim().min(2).max(100),
    pickupLocation: z.string().trim().min(2).max(120),
    pickupDate: z.string().trim().regex(DATE_PATTERN, "Date de retrait invalide"),
    returnDate: z.string().trim().regex(DATE_PATTERN, "Date de retour invalide"),
    message: z.string().trim().max(500).optional().or(z.literal("")),
    website: z.string().trim().max(0).optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    const pickupValid = isValidIsoDate(data.pickupDate);
    const returnValid = isValidIsoDate(data.returnDate);

    if (!pickupValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pickupDate"],
        message: "Date de retrait invalide",
      });
    }

    if (!returnValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnDate"],
        message: "Date de retour invalide",
      });
    }

    if (pickupValid && data.pickupDate < todayIsoDate()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pickupDate"],
        message: "La date de retrait ne peut pas etre dans le passe",
      });
    }

    if (pickupValid && returnValid && data.returnDate <= data.pickupDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["returnDate"],
        message: "La date de retour doit etre apres la date de retrait",
      });
    }
  });

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

async function insertReservation(payload) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Configuration Supabase manquante.");
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify([payload]),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || "Impossible d'enregistrer la reservation.";
    throw new Error(message);
  }

  return Array.isArray(data) ? data[0] : data;
}

async function sendWhatsappNotification(payload) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_WHATSAPP_FROM;
  const to = process.env.TWILIO_WHATSAPP_TO;

  if (!accountSid || !authToken || !from || !to) {
    return { sent: false, reason: "Twilio not configured" };
  }

  const client = twilio(accountSid, authToken);
  const whatsappBody = [
    "Nouvelle reservation",
    "",
    `Client: ${payload.full_name}`,
    `Telephone: ${payload.phone}`,
    `Email: ${payload.email || "Non renseigne"}`,
    `Voiture: ${payload.car}`,
    `Lieu de retrait: ${payload.pickup_location}`,
    `Date de retrait: ${payload.pickup_date}`,
    `Date de retour: ${payload.return_date}`,
    `Message: ${payload.message || "Aucun"}`,
  ].join("\n");

  const message = await client.messages.create({
    body: whatsappBody,
    from,
    to,
  });

  return { sent: true, sid: message.sid };
}

export default async (request) => {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  const reservationRateLimit = checkRateLimit(request, {
    prefix: "reservations",
    max: readPositiveIntEnv("RESERVATION_RATE_LIMIT_MAX", 10),
    windowMs: readPositiveIntEnv("RESERVATION_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  });

  if (reservationRateLimit.limited) {
    return json(
      {
        success: false,
        error: "Trop de demandes, veuillez reessayer plus tard.",
      },
      429,
      { "Retry-After": String(reservationRateLimit.retryAfter) }
    );
  }

  try {
    const body = await request.json();
    const parsedPayload = reservationSchema.safeParse(body);

    if (!parsedPayload.success) {
      return json(
        {
          success: false,
          error: "Donnees de reservation invalides.",
          details: parsedPayload.error.issues.map((issue) => issue.message),
        },
        400
      );
    }

    const reservationPayload = {
      full_name: parsedPayload.data.fullName,
      phone: parsedPayload.data.phone,
      email: parsedPayload.data.email || null,
      car: parsedPayload.data.car,
      pickup_location: parsedPayload.data.pickupLocation,
      pickup_date: parsedPayload.data.pickupDate,
      return_date: parsedPayload.data.returnDate,
      message: parsedPayload.data.message || null,
      source: "website",
      status: "pending",
    };

    const reservation = await insertReservation(reservationPayload);

    let whatsappResult = { sent: false };

    try {
      whatsappResult = await sendWhatsappNotification(reservationPayload);
    } catch (twilioError) {
      console.error("Twilio notification failed:", twilioError);
    }

    return json({
      success: true,
      reservationId: reservation?.id ?? null,
      whatsappSent: Boolean(whatsappResult.sent),
    });
  } catch (error) {
    console.error("Reservation function error:", error);

    return json(
      {
        success: false,
        error: "Impossible de traiter la reservation pour le moment.",
      },
      500
    );
  }
};
