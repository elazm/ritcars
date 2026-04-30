import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';

dotenv.config();

console.log('ENV CHECK:', {
  sid: process.env.TWILIO_ACCOUNT_SID ? 'loaded' : 'missing',
  token: process.env.TWILIO_AUTH_TOKEN ? 'loaded' : 'missing',
  from: process.env.TWILIO_WHATSAPP_FROM ? 'loaded' : 'missing',
  to: process.env.TWILIO_WHATSAPP_TO ? 'loaded' : 'missing',
  supabaseUrl: process.env.SUPABASE_URL ? 'loaded' : 'missing',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'loaded' : 'missing',
});

const app = express();

const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:5173,https://ritcars.onrender.com'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
  })
);

app.use(express.json());

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidIsoDate(value) {
  if (!DATE_PATTERN.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
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

const reservationRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number.parseInt(process.env.RESERVATION_RATE_LIMIT_MAX || '10', 10),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Trop de demandes, veuillez reessayer plus tard.',
  },
});

const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Trop de demandes pour les operations admin. Veuillez reessayer plus tard.',
  },
  skip: (req) => {
    const token = (req.headers.authorization || '').replace('Bearer ', '');
    return token === process.env.ADMIN_DASHBOARD_TOKEN;
  },
});

const reservationSchema = z
  .object({
    fullName: z.string().trim().min(2).max(100),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[0-9\s\-()]{8,20}$/, 'Numero de telephone invalide'),
    email: z.string().trim().email().max(254).optional().or(z.literal('')),
    car: z.string().trim().min(2).max(100),
    pickupLocation: z.string().trim().min(2).max(120),
    pickupDate: z.string().trim().regex(DATE_PATTERN, 'Date de retrait invalide'),
    returnDate: z.string().trim().regex(DATE_PATTERN, 'Date de retour invalide'),
    message: z.string().trim().max(500).optional().or(z.literal('')),
    website: z.string().trim().max(0).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const pickupValid = isValidIsoDate(data.pickupDate);
    const returnValid = isValidIsoDate(data.returnDate);

    if (!pickupValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pickupDate'],
        message: 'Date de retrait invalide',
      });
    }

    if (!returnValid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['returnDate'],
        message: 'Date de retour invalide',
      });
    }

    if (pickupValid && data.pickupDate < todayIsoDate()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pickupDate'],
        message: 'La date de retrait ne peut pas etre dans le passe',
      });
    }

    if (pickupValid && returnValid && data.returnDate <= data.pickupDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['returnDate'],
        message: 'La date de retour doit etre apres la date de retrait',
      });
    }
  });

async function insertReservation(payload) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuration Supabase manquante.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/reservations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=representation',
    },
    body: JSON.stringify([payload]),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message || data?.error || 'Impossible d\'enregistrer la reservation.';
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
    return { sent: false, reason: 'Twilio not configured' };
  }

  const client = twilio(accountSid, authToken);
  const whatsappBody = [
    'Nouvelle reservation',
    '',
    `Client: ${payload.full_name}`,
    `Telephone: ${payload.phone}`,
    `Email: ${payload.email || 'Non renseigne'}`,
    `Voiture: ${payload.car}`,
    `Lieu de retrait: ${payload.pickup_location}`,
    `Date de retrait: ${payload.pickup_date}`,
    `Date de retour: ${payload.return_date}`,
    `Message: ${payload.message || 'Aucun'}`,
  ].join('\n');

  const message = await client.messages.create({
    body: whatsappBody,
    from,
    to,
  });

  return { sent: true, sid: message.sid };
}

function jsonResponse(data, status = 200) {
  return { status, body: data };
}

function requireAdminAuth(req) {
  const expectedToken = process.env.ADMIN_DASHBOARD_TOKEN;

  if (!expectedToken) {
    throw new Error('Configuration admin manquante.');
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice('Bearer '.length).trim()
    : '';

  return token === expectedToken;
}

async function fetchReservations() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuration Supabase manquante.');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/reservations?select=*&order=created_at.desc`,
    {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Impossible de recuperer les reservations.';
    throw new Error(message);
  }

  return Array.isArray(data) ? data : [];
}

async function updateReservationStatus(id, status) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuration Supabase manquante.');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/reservations?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ status }),
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Impossible de mettre a jour la reservation.';
    throw new Error(message);
  }

  return Array.isArray(data) ? data[0] ?? null : data;
}

async function deleteReservation(id) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Configuration Supabase manquante.');
  }

  const response = await fetch(
    `${supabaseUrl}/rest/v1/reservations?id=eq.${id}`,
    {
      method: 'DELETE',
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: 'return=representation',
      },
    }
  );

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || data?.error || 'Impossible de supprimer la reservation.';
    throw new Error(message);
  }

  return;
}

app.get('/', (req, res) => {
  res.send('Ritcars backend is running');
});

app.get('/api/reservations', (req, res) => {
  res.send('Reservations API is working');
});

app.get('/api/admin/reservations', adminRateLimit, async (req, res) => {
  try {
    if (!requireAdminAuth(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const reservations = await fetchReservations();

    return res.status(200).json({ success: true, reservations });
  } catch (error) {
    console.error('Admin reservations list error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur serveur inconnue',
    });
  }
});

app.post('/api/admin/reservations/status', adminRateLimit, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    if (!requireAdminAuth(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const updateSchema = z.object({
      id: z.string().uuid('Identifiant invalide'),
      status: z.enum(['pending', 'confirmed', 'cancelled']),
    });

    const parsed = updateSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Donnees invalides.',
        details: parsed.error.issues.map((issue) => issue.message),
      });
    }

    const reservation = await updateReservationStatus(parsed.data.id, parsed.data.status);

    return res.status(200).json({ success: true, reservation });
  } catch (error) {
    console.error('Admin reservation status update error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur serveur inconnue',
    });
  }
});

app.post('/api/admin/reservations/delete', adminRateLimit, async (req, res) => {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    if (!requireAdminAuth(req)) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const deleteSchema = z.object({
      id: z.string().uuid('Identifiant invalide'),
    });

    const parsed = deleteSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Donnees invalides.',
        details: parsed.error.issues.map((issue) => issue.message),
      });
    }

    await deleteReservation(parsed.data.id);

    return res.status(200).json({ success: true, deletedId: parsed.data.id });
  } catch (error) {
    console.error('Admin reservation delete error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Erreur serveur inconnue',
    });
  }
});

app.post('/api/reservations', reservationRateLimit, async (req, res) => {
  try {
    const parsedPayload = reservationSchema.safeParse(req.body);

    if (!parsedPayload.success) {
      return res.status(400).json({
        success: false,
        error: 'Donnees de reservation invalides.',
        details: parsedPayload.error.issues.map((issue) => issue.message),
      });
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
      status: 'pending',
      source: 'website',
    };

    const supabaseConfigured =
      Boolean(process.env.SUPABASE_URL) &&
      Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
    const twilioConfigured =
      Boolean(process.env.TWILIO_ACCOUNT_SID) &&
      Boolean(process.env.TWILIO_AUTH_TOKEN) &&
      Boolean(process.env.TWILIO_WHATSAPP_FROM) &&
      Boolean(process.env.TWILIO_WHATSAPP_TO);

    let storedReservation = null;
    let supabaseError = null;
    let whatsappResult = { sent: false, reason: null };

    if (supabaseConfigured) {
      try {
        storedReservation = await insertReservation(reservationPayload);
      } catch (error) {
        supabaseError = error instanceof Error ? error.message : 'Erreur Supabase inconnue';
        console.error('Supabase insert failed:', supabaseError);
      }
    }

    if (twilioConfigured) {
      try {
        whatsappResult = await sendWhatsappNotification(reservationPayload);
      } catch (error) {
        whatsappResult = {
          sent: false,
          reason: error instanceof Error ? error.message : 'Erreur WhatsApp inconnue',
        };
        console.error('Twilio notification failed:', whatsappResult.reason);
      }
    }

    if (!storedReservation && !whatsappResult.sent) {
      return res.status(500).json({
        success: false,
        error: 'Impossible de traiter la reservation. Verifiez la configuration du serveur.',
      });
    }

    return res.status(200).json({
      success: true,
      stored: Boolean(storedReservation),
      whatsappSent: whatsappResult.sent,
      reservationId: storedReservation?.id || null,
    });
  } catch (error) {
    console.error('Reservation route error:', error);

    return res.status(500).json({
      success: false,
      error: 'Erreur serveur inconnue',
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
