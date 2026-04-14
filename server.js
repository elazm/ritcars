import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

dotenv.config();

const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

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

app.post('/api/reservations', async (req, res) => {
  try {
    console.log('Incoming reservation:', req.body);

    const {
      fullName,
      phone,
      email,
      car,
      pickupLocation,
      pickupDate,
      returnDate,
      message,
    } = req.body;

    if (!fullName || !phone || !car || !pickupLocation || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        error: 'Champs requis manquants.',
      });
    }

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
      error: error.message || 'Erreur serveur inconnue',
    });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});