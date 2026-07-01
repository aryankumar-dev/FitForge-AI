import getTransporter from "./mailer.js";

/**
 * Sends an email via nodemailer. Always merges ADMIN_EMAIL into bcc
 * (deduping if `to` already equals the admin email). Never throws -
 * failures are logged so they never break the calling API request.
 *
 * @param {Object} options
 * @param {string|string[]} options.to
 * @param {string|string[]} [options.bcc]
 * @param {string} options.subject
 * @param {string} options.html
 */
const sendEmail = async ({ to, bcc, subject, html }) => {
  try {
    const transporter = getTransporter();
    if (!transporter) {
      console.warn(`Email not sent (SMTP not configured). Subject: ${subject}`);
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    const toList = Array.isArray(to) ? to : [to];
    let bccList = bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : [];

    if (adminEmail && !toList.includes(adminEmail) && !bccList.includes(adminEmail)) {
      bccList.push(adminEmail);
    }

    // dedupe
    bccList = [...new Set(bccList.filter(Boolean))];

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: toList.join(", "),
      subject,
      html,
    };

    if (bccList.length > 0) {
      mailOptions.bcc = bccList.join(", ");
    }

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(`Failed to send email "${subject}":`, error.message);
  }
};

export default sendEmail;
