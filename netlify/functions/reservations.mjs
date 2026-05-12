import { z } from "zod";
import nodemailer from "nodemailer";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const rateLimitStore = new Map();
const OWNER_EMAIL = "ritcarsrent@gmail.com";

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
      if (storedBucket.resetAt <= now) rateLimitStore.delete(storedKey);
    }
  }

  if (!bucket || bucket.resetAt <= now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { limited: false, retryAfter: 0 };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return { limited: true, retryAfter: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
  }
  return { limited: false, retryAfter: 0 };
}

function isValidIsoDate(value) {
  if (!DATE_PATTERN.test(value)) return false;
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
    phone: z.string().trim().regex(/^\+?[0-9\s\-()]{8,20}$/, "Numero de telephone invalide"),
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

    if (!pickupValid) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pickupDate"], message: "Date de retrait invalide" });
    if (!returnValid) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["returnDate"], message: "Date de retour invalide" });
    if (pickupValid && data.pickupDate < todayIsoDate()) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["pickupDate"], message: "La date de retrait ne peut pas etre dans le passe" });
    if (pickupValid && returnValid && data.returnDate <= data.pickupDate) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["returnDate"], message: "La date de retour doit etre apres la date de retrait" });
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

  if (!supabaseUrl || !serviceRoleKey) throw new Error("Configuration Supabase manquante.");

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
  if (!response.ok) throw new Error(data?.message || data?.error || "Impossible d'enregistrer la reservation.");
  return Array.isArray(data) ? data[0] : data;
}

async function sendEmails(payload) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) return { sent: false, reason: "Gmail not configured" };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const ownerHtml = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
      <h2 style="color:#ff5a1f;margin-top:0;">🚗 Nouvelle Réservation - Rit Cars</h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#555;width:140px;"><strong>Client</strong></td><td style="padding:8px 0;">${payload.full_name}</td></tr>
        <tr><td style="padding:8px 0;color:#555;"><strong>Téléphone</strong></td><td style="padding:8px 0;">${payload.phone}</td></tr>
        <tr><td style="padding:8px 0;color:#555;"><strong>Email</strong></td><td style="padding:8px 0;">${payload.email || "Non renseigné"}</td></tr>
        <tr><td style="padding:8px 0;color:#555;"><strong>Voiture</strong></td><td style="padding:8px 0;">${payload.car}</td></tr>
        <tr><td style="padding:8px 0;color:#555;"><strong>Lieu de retrait</strong></td><td style="padding:8px 0;">${payload.pickup_location}</td></tr>
        <tr><td style="padding:8px 0;color:#555;"><strong>Date de retrait</strong></td><td style="padding:8px 0;">${payload.pickup_date}</td></tr>
        <tr><td style="padding:8px 0;color:#555;"><strong>Date de retour</strong></td><td style="padding:8px 0;">${payload.return_date}</td></tr>
        <tr><td style="padding:8px 0;color:#555;"><strong>Message</strong></td><td style="padding:8px 0;">${payload.message || "Aucun"}</td></tr>
      </table>
    </div>`;

  const emails = [
    transporter.sendMail({
      from: `"Rit Cars" <${gmailUser}>`,
      to: OWNER_EMAIL,
      subject: `Nouvelle réservation - ${payload.full_name} - ${payload.car}`,
      html: ownerHtml,
    }),
  ];

  if (payload.email) {
    const customerHtml = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:8px;">
        <h2 style="color:#ff5a1f;margin-top:0;">Votre réservation est confirmée ✅</h2>
        <p>Bonjour <strong>${payload.full_name}</strong>,</p>
        <p>Nous avons bien reçu votre demande de réservation. Nous vous contacterons très prochainement pour confirmer les détails.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px 0;color:#555;width:140px;"><strong>Voiture</strong></td><td style="padding:8px 0;">${payload.car}</td></tr>
          <tr><td style="padding:8px 0;color:#555;"><strong>Lieu de retrait</strong></td><td style="padding:8px 0;">${payload.pickup_location}</td></tr>
          <tr><td style="padding:8px 0;color:#555;"><strong>Date de retrait</strong></td><td style="padding:8px 0;">${payload.pickup_date}</td></tr>
          <tr><td style="padding:8px 0;color:#555;"><strong>Date de retour</strong></td><td style="padding:8px 0;">${payload.return_date}</td></tr>
        </table>
        <p style="color:#555;">Pour toute question, contactez-nous sur WhatsApp : <strong>+212 762253818</strong></p>
        <p style="color:#888;font-size:13px;">Merci de votre confiance,<br/><strong>L'équipe Rit Cars</strong></p>
      </div>`;

    emails.push(
      transporter.sendMail({
        from: `"Rit Cars" <${gmailUser}>`,
        to: payload.email,
        subject: "Votre réservation Rit Cars est reçue",
        html: customerHtml,
      })
    );
  }

  await Promise.allSettled(emails);
  return { sent: true };
}

export default async (request) => {
  if (request.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);

  const reservationRateLimit = checkRateLimit(request, {
    prefix: "reservations",
    max: readPositiveIntEnv("RESERVATION_RATE_LIMIT_MAX", 10),
    windowMs: readPositiveIntEnv("RESERVATION_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  });

  if (reservationRateLimit.limited) {
    return json({ success: false, error: "Trop de demandes, veuillez reessayer plus tard." }, 429, {
      "Retry-After": String(reservationRateLimit.retryAfter),
    });
  }

  try {
    const body = await request.json();
    const parsedPayload = reservationSchema.safeParse(body);

    if (!parsedPayload.success) {
      return json({ success: false, error: "Donnees de reservation invalides.", details: parsedPayload.error.issues.map((i) => i.message) }, 400);
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

    try {
      await sendEmails(reservationPayload);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return json({ success: true, reservationId: reservation?.id ?? null });
  } catch (error) {
    console.error("Reservation function error:", error);
    return json({ success: false, error: "Impossible de traiter la reservation pour le moment." }, 500);
  }
};
