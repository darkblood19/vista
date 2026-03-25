import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // App-specific password, not your actual Google password
  },
});

// Send confirmation email
async function sendConfirmationEmail(recipientEmail, name, confirmUrl) {
  const mailOptions = {
    from: `"Condominio" <${process.env.GMAIL_USER}>`,
    to: recipientEmail,
    subject: "Confirma tu correo electrónico - Condominio",
    html: `
      <h2>¡Bienvenido a Condominio, ${name}!</h2>
      <p>Haz clic en el siguiente enlace para confirmar tu dirección de correo:</p>
      <p><a href="${confirmUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Confirmar correo</a></p>
      <p>O copia y pega esta URL en tu navegador:</p>
      <p>${confirmUrl}</p>
      <p>Si no creaste esta cuenta, ignora este correo.</p>
      <hr />
      <p style="font-size: 12px; color: #666;">Este correo fue enviado automáticamente. No respondas a este correo.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);
    return true;
  } catch (err) {
    console.error("Error al enviar correo:", err);
    return false;
  }
}

export { sendConfirmationEmail };
