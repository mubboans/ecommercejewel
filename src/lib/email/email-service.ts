import nodemailer from 'nodemailer';

/**
 * Email Service for sending transactional emails
 * Supports Gmail, SendGrid, AWS SES, and other SMTP providers
 */

// Email configuration from environment variables
const EMAIL_CONFIG = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_FROM_EMAIL || '',
    pass: process.env.SMTP_PASSWORD || '',
  },
};

const FROM_EMAIL = process.env.SMTP_FROM_EMAIL || 'noreply@example.com';
const FROM_NAME = process.env.SMTP_FROM_NAME || 'Dilaara Jewelry';

// Create reusable transporter
const createTransporter = () => {
  if (!EMAIL_CONFIG.auth.user || !EMAIL_CONFIG.auth.pass) {
    console.warn('SMTP credentials not configured. Emails will not be sent.');
    return null;
  }

  return nodemailer.createTransport(EMAIL_CONFIG);
};

/**
 * Base email template with beautiful styling
 */
const getEmailTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      font-size: 28px;
      font-weight: 700;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .header p {
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .otp-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .otp-code {
      font-size: 42px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #ffffff;
      font-family: 'Courier New', monospace;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .otp-label {
      color: #ffffff;
      font-size: 14px;
      margin-bottom: 12px;
      opacity: 0.9;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-box {
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 4px;
    }
    .info-box p {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    .footer {
      background: #f8f9fa;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e9ecef;
    }
    .footer p {
      font-size: 13px;
      color: #6c757d;
      margin: 8px 0;
    }
    .footer a {
      color: #667eea;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-2px);
    }
    .divider {
      height: 1px;
      background: #e9ecef;
      margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
      .container {
        margin: 20px;
        border-radius: 8px;
      }
      .header {
        padding: 30px 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content {
        padding: 30px 20px;
      }
      .otp-code {
        font-size: 36px;
        letter-spacing: 6px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✨ ${FROM_NAME}</h1>
      <p>Handcrafted Jewelry with Love</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>${FROM_NAME}</strong></p>
      <p>Discover beautiful handcrafted jewelry</p>
      <div class="divider" style="margin: 20px auto; max-width: 200px;"></div>
      <p style="font-size: 12px; color: #999;">
        This is an automated email. Please do not reply to this message.
      </p>
      <p style="font-size: 12px; color: #999;">
        © ${new Date().getFullYear()} ${FROM_NAME}. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * OTP Verification Email Template
 */
export const getOTPEmailHTML = (otp: string, name?: string) => {
  const content = `
    <h2 style="color: #333; margin-bottom: 16px;">
      ${name ? `Hello ${name}!` : 'Hello!'}
    </h2>
    <p style="font-size: 16px; color: #666; margin-bottom: 24px;">
      Thank you for signing up! Please use the verification code below to complete your registration.
    </p>
    
    <div class="otp-box">
      <div class="otp-label">Your Verification Code</div>
      <div class="otp-code">${otp}</div>
    </div>
    
    <div class="info-box">
      <p><strong>⏱️ This code will expire in 10 minutes</strong></p>
      <p style="margin-top: 8px;">If you didn't request this code, please ignore this email.</p>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 24px;">
      For security reasons, never share this code with anyone. Our team will never ask for your verification code.
    </p>
  `;

  return getEmailTemplate(content, 'Verify Your Email');
};

/**
 * Welcome Email Template
 */
export const getWelcomeEmailHTML = (name: string) => {
  const content = `
    <h2 style="color: #333; margin-bottom: 16px;">
      Welcome to ${FROM_NAME}! 🎉
    </h2>
    <p style="font-size: 16px; color: #666; margin-bottom: 24px;">
      Hi ${name}, we're thrilled to have you join our community of jewelry lovers!
    </p>
    
    <div style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 12px; padding: 24px; margin: 24px 0;">
      <h3 style="color: #667eea; margin-bottom: 12px;">What's Next?</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="padding: 8px 0; color: #666;">
          ✨ Explore our exclusive collection of handcrafted jewelry
        </li>
        <li style="padding: 8px 0; color: #666;">
          🎁 Get special offers and early access to new arrivals
        </li>
        <li style="padding: 8px 0; color: #666;">
          💎 Earn loyalty points with every purchase
        </li>
      </ul>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}" class="button">
        Start Shopping
      </a>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 24px;">
      If you have any questions, feel free to reach out to our support team. We're here to help!
    </p>
  `;

  return getEmailTemplate(content, 'Welcome to ' + FROM_NAME);
};

/**
 * Password Reset Email Template
 */
export const getPasswordResetEmailHTML = (otp: string, name?: string) => {
  const content = `
    <h2 style="color: #333; margin-bottom: 16px;">
      ${name ? `Hello ${name}!` : 'Hello!'}
    </h2>
    <p style="font-size: 16px; color: #666; margin-bottom: 24px;">
      We received a request to reset your password. Use the code below to proceed.
    </p>
    
    <div class="otp-box">
      <div class="otp-label">Password Reset Code</div>
      <div class="otp-code">${otp}</div>
    </div>
    
    <div class="info-box">
      <p><strong>⏱️ This code will expire in 10 minutes</strong></p>
      <p style="margin-top: 8px;">If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-top: 24px;">
      For security reasons, never share this code with anyone.
    </p>
  `;

  return getEmailTemplate(content, 'Reset Your Password');
};

/**
 * Send OTP Email
 */
export async function sendOTPEmail(
  to: string,
  otp: string,
  purpose: 'registration' | 'password-reset' = 'registration',
  name?: string
): Promise<boolean> {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const subject = purpose === 'registration'
      ? 'Verify Your Email - ' + FROM_NAME
      : 'Reset Your Password - ' + FROM_NAME;

    const html = purpose === 'registration'
      ? getOTPEmailHTML(otp, name)
      : getPasswordResetEmailHTML(otp, name);

    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

/**
 * Send Welcome Email
 */
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      console.error('Email transporter not configured');
      return false;
    }

    const mailOptions = {
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject: `Welcome to ${FROM_NAME}! 🎉`,
      html: getWelcomeEmailHTML(name),
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    const transporter = createTransporter();

    if (!transporter) {
      return false;
    }

    await transporter.verify();
    console.log('✅ Email service is ready');
    return true;
  } catch (error) {
    console.error('❌ Email service configuration error:', error);
    return false;
  }
}
