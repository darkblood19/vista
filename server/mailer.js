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

// Send password reset code
async function sendPasswordResetCode(recipientEmail, name, resetCode) {
  const mailOptions = {
    from: `"Condominio" <${process.env.GMAIL_USER}>`,
    to: recipientEmail,
    subject: "Código para recuperar tu contraseña - Condominio",
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Hola ${name},</p>
      <p>Hemos recibido una solicitud para recuperar tu contraseña. Usa el siguiente código para continuar:</p>
      <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <h1 style="color: #333; letter-spacing: 5px; font-family: monospace;">${resetCode}</h1>
      </div>
      <p><strong>Este código expira en 15 minutos.</strong></p>
      <p>Si no solicitaste recuperar tu contraseña, ignora este correo.</p>
      <hr />
      <p style="font-size: 12px; color: #666;">Este correo fue enviado automáticamente. No respondas a este correo.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo de recuperación enviado:", info.response);
    return true;
  } catch (err) {
    console.error("Error al enviar correo de recuperación:", err);
    return false;
  }
}

export { sendConfirmationEmail, sendPasswordResetCode };
