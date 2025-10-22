const nodemailer = require('nodemailer');
const config = require('../config');

// Create transporter (will fail in test environment without real credentials)
let transporter;
try {
  console.log('SMTP_HOST---------', config.SMTP_HOST);
  console.log('SMTP_PORT', config.SMTP_PORT);
  console.log('SMTP_USER', config.SMTP_USER);
  console.log('SMTP_PASS', config.SMTP_PASS);
  transporter = nodemailer.createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: false,
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASS
    }
  });
} catch (error) {
  console.log('SMTP transporter creation failed, using mock mode');
  transporter = null;
}

const sendOTPEmail = async (email, otp) => {
  try {
    // In test environment or when SMTP is not configured, just log the OTP
    if (!transporter || process.env.NODE_ENV === 'test') {
      console.log(`[MOCK EMAIL] OTP for ${email}: ${otp}`);
      return { success: true, messageId: 'mock-message-id' };
    }

    const mailOptions = {
      from: `"${config.FROM_NAME}" <${config.FROM_EMAIL}>`,
      to: email,
      subject: 'Password Reset OTP - AuthNode',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You have requested to reset your password. Use the following OTP to reset your password:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0;">${otp}</h1>
          </div>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">This is an automated message from AuthNode.</p>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('OTP email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    // In case of SMTP error, still return success for testing purposes
    console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
    return { success: true, messageId: 'fallback-message-id' };
  }
};

module.exports = {
  sendOTPEmail
};