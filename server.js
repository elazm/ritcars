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
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('Origin not allowed by CORS'));
    },
  })
);
app.use(express.json());

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
    pickupDate: z.string().trim().min(10).max(10),
    returnDate: z.string().trim().min(10).max(10),
    message: z.string().trim().max(500).optional().or(z.literal('')),
  })
  .superRefine((data, ctx) => {
    const pickup = new Date(data.pickupDate);
    const back = new Date(data.returnDate);

    if (Number.isNaN(pickup.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pickupDate'],
        message: 'Date de retrait invalide',
      });
    }

    if (Number.isNaN(back.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['returnDate'],
        message: 'Date de retour invalide',
      });
    }

    if (!Number.isNaN(pickup.getTime()) && !Number.isNaN(back.getTime()) && back <= pickup) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['returnDate'],
        message: 'La date de retour doit etre apres la date de retrait',
      });
    }
  });

app.get('/', (req, res) => {
  res.send('Ritcars backend is running');
});

app.get('/api/reservations', (req, res) => {
  res.send('Reservations API is working');
});

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

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

    const {
      fullName,
      phone,
      email,
      car,
      pickupLocation,
      pickupDate,
      returnDate,
      message,
    } = parsedPayload.data;

    console.log('Incoming reservation accepted for car:', car);

    const whatsappBody = `🚗 Nouvelle réservation

👤 Client: ${fullName}
📞 Téléphone: ${phone}
📧 Email: ${email || 'Non renseigné'}
🚘 Voiture: ${car}
📍 Lieu de retrait: ${pickupLocation}
📅 Date de retrait: ${pickupDate}
📅 Date de retour: ${returnDate}
📝 Message: ${message || 'Aucun'}`;

    const twilioMessage = await client.messages.create({
      body: whatsappBody,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO,
    });

    console.log('Twilio message sent:', twilioMessage.sid);

    res.status(200).json({
      success: true,
      sid: twilioMessage.sid,
    });
  } catch (error) {
    console.error('Reservation route error:', error);

    res.status(500).json({
      success: false,
      error: 'Erreur serveur inconnue',
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});