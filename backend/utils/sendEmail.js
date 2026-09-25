import nodemailer from "nodemailer";

/**
 * Send email utility with support for SMTP and graceful fallback
 * @param {Object} options - { email, subject, message, html }
 */
export const sendEmail = async (options) => {
  const { email, subject, message, html } = options;

  const hasSmtpConfig = Boolean(
    process.env.SMTP_MAIL && process.env.SMTP_PASSWORD
  );

  if (hasSmtpConfig) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      service: process.env.SMTP_SERVICE || "gmail",
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"Velura Luxury" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject: subject,
      text: message,
      html: html || `<p>${message}</p>`,
    };

    return await transporter.sendMail(mailOptions);
  }

  // If SMTP is not yet configured, log detailed information to server console
  console.warn("\n=======================================================");
  console.warn("⚠️  [EMAIL SERVICE NOTIFICATION] ⚠️");
  console.warn(`To: ${email}`);
  console.warn(`Subject: ${subject}`);
  console.warn(`Message:\n${message}`);
  console.warn("Notice: Add SMTP_MAIL & SMTP_PASSWORD to backend/.env for live email delivery.");
  console.warn("=======================================================\n");

  return {
    simulated: true,
    message: "Email simulated (SMTP not configured in .env)",
  };
};

export default sendEmail;
