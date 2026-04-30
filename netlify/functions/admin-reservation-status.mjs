import { z } from "zod";
import { timingSafeEqual } from "node:crypto";

const updateSchema = z.object({
  id: z.string().uuid("Identifiant invalide"),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

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

function secureCompare(providedToken, expectedToken) {
  const providedBuffer = Buffer.from(providedToken);
  const expectedBuffer = Buffer.from(expectedToken);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extraHeaders },
  });
}

function isAuthorized(request) {
  const expectedToken = process.env.ADMIN_DASHBOARD_TOKEN;

  if (!expectedToken) {
    throw new Error("Configuration admin manquante.");
  }

  const authHeader = request.headers.get("authorization") || "";
  const providedToken = authHeader.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length).trim()
    : "";

  return secureCompare(providedToken, expectedToken);
}

export default async (request) => {
  if (request.method !== "POST") {
    return json({ success: false, error: "Method not allowed" }, 405);
  }

  const adminRateLimit = checkRateLimit(request, {
    prefix: "admin-reservation-status",
    max: readPositiveIntEnv("ADMIN_RATE_LIMIT_MAX", 30),
    windowMs: readPositiveIntEnv("ADMIN_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  });

  if (adminRateLimit.limited) {
    return json(
      {
        success: false,
        error: "Trop de demandes pour les operations admin. Veuillez reessayer plus tard.",
      },
      429,
      { "Retry-After": String(adminRateLimit.retryAfter) }
    );
  }

  try {
    if (!isAuthorized(request)) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ success: false, error: "Configuration Supabase manquante." }, 500);
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return json(
        {
          success: false,
          error: "Donnees invalides.",
          details: parsed.error.issues.map((issue) => issue.message),
        },
        400
      );
    }

    const response = await fetch(
      `${supabaseUrl}/rest/v1/reservations?id=eq.${parsed.data.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: serviceRoleKey,
          Authorization: `Bearer ${serviceRoleKey}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status: parsed.data.status }),
      }
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message =
        data?.message || data?.error || "Impossible de mettre a jour la reservation.";
      return json({ success: false, error: message }, 500);
    }

    return json({
      success: true,
      reservation: Array.isArray(data) ? data[0] ?? null : data,
    });
  } catch (error) {
    console.error("Admin reservation status update error:", error);

    return json(
      {
        success: false,
        error: "Erreur serveur inconnue",
      },
      500
    );
  }
};
