import nodemailer from "nodemailer";
import { TERMS_AND_CONDITIONS } from "./terms";

// ─── Transporter ─────────────────────────────────────────────────────────────
const smtpPort = Number(process.env.SMTP_PORT ?? 587);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465, // SSL/TLS is true only for port 465. Port 587 uses STARTTLS (secure: false)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper to check if SMTP settings are placeholders/dummy values
function isSMTPEmpty() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return !user || !pass || user.includes("your-") || pass.includes("your-");
}

// ─── Welcome Email ────────────────────────────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string) {
  if (isSMTPEmpty()) {
    console.warn(`[SMTP Sandbox Warning] Dummy email credentials detected. Welcome email not transmitted to: ${to}`);
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to the Broadcasting Network</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #050b18; font-family: 'Inter', sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .card {
      background: linear-gradient(135deg, #0d1b2e 0%, #0a1628 100%);
      border: 1px solid rgba(0, 212, 255, 0.2);
      border-radius: 16px;
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #00d4ff10, #7c3aed10);
      border-bottom: 1px solid rgba(0, 212, 255, 0.15);
      padding: 36px 40px;
      text-align: center;
    }
    .logo-text {
      font-size: 22px;
      font-weight: 700;
      background: linear-gradient(90deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .logo-sub {
      color: rgba(148,163,184,0.7);
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-top: 4px;
    }
    .body { padding: 40px; }
    .greeting {
      color: #e2e8f0;
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .message {
      color: #94a3b8;
      font-size: 15px;
      line-height: 1.8;
      margin-bottom: 16px;
    }
    .divider {
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent);
      margin: 32px 0;
    }
    .signature { color: #94a3b8; font-size: 14px; line-height: 1.7; }
    .sig-name { color: #00d4ff; font-weight: 700; font-size: 16px; }
    .sig-title { color: rgba(148,163,184,0.6); font-size: 12px; letter-spacing: 1px; }
    .footer {
      text-align: center;
      padding: 20px 40px;
      border-top: 1px solid rgba(0,212,255,0.1);
      color: rgba(148,163,184,0.4);
      font-size: 11px;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="logo-text">⬡ Broadcasting Network</div>
        <div class="logo-sub">Payment Infrastructure</div>
      </div>
      <div class="body">
        <p class="greeting">Good day, ${name || "Valued Member"},</p>
        <p class="message">
          My name is Big, and on behalf of the entire team, I want to personally
          welcome you to the Broadcasting Network.
        </p>
        <p class="message">
          We are truly excited and grateful that you chose us as your trusted
          partner to receive and deliver your payments seamlessly.
        </p>
        <p class="message">
          Our commitment is simple: We will work diligently to ensure every
          payment you receive is processed quickly, securely, and reliably.
        </p>
        <p class="message">
          Thank you for trusting us with this important part of your journey.
          We're here to support you every step of the way.
        </p>
        <p class="message">
          If you have any questions, our support team is just a click away.
        </p>
        <div class="divider"></div>
        <div class="signature">
          <p>Best regards,</p>
          <p class="sig-name">Big</p>
          <p class="sig-title">CEO, Broadcasting Network</p>
        </div>
      </div>
      <div class="footer">© 2026 Broadcasting Network · Payment Infrastructure</div>
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
Good day, ${name || "Valued Member"},

My name is Big, and on behalf of the entire team, I want to personally welcome you to the Broadcasting Network.

We are truly excited and grateful that you chose us as your trusted partner to receive and deliver your payments seamlessly.

Our commitment is simple: We will work diligently to ensure every payment you receive is processed quickly, securely, and reliably.

Thank you for trusting us with this important part of your journey. We're here to support you every step of the way.

If you have any questions, our support team is just a click away.

Best regards,
Big
CEO, Broadcasting Network
  `.trim();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Broadcasting Network" <${process.env.SMTP_USER}>`,
    to,
    subject: "Welcome to the Broadcasting Network!",
    text,
    html,
  });
}

// ─── Terms & Conditions Email ──────────────────────────────────────────────────
export async function sendTermsEmail(to: string, name: string) {
  if (isSMTPEmpty()) {
    console.warn(`[SMTP Sandbox Warning] Dummy credentials. Terms & Conditions email not transmitted to: ${to}`);
    return;
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Broadcasting Network - Terms and Conditions</title>
  <style>
    body { background: #050b18; color: #94a3b8; font-family: sans-serif; padding: 20px; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; background: #0d1b2e; border: 1px solid rgba(0, 212, 255, 0.2); border-radius: 12px; padding: 30px; }
    h2 { color: #00d4ff; text-align: center; }
    .terms-box { background: rgba(5, 11, 24, 0.6); padding: 15px; border-radius: 8px; border: 1px solid rgba(148,163,184,0.1); font-size: 13px; font-family: monospace; white-space: pre-wrap; height: 350px; overflow-y: scroll; color: #cbd5e1; }
    .warning-section { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 15px; border-radius: 8px; margin: 20px 0; font-size: 14px; font-weight: bold; }
    .footer { text-align: center; font-size: 11px; margin-top: 25px; color: rgba(148,163,184,0.4); }
  </style>
</head>
<body>
  <div class="container">
    <h2>Legal Framework Node Setup</h2>
    <p>Good day, ${name || "Operator"},</p>
    <p>You have successfully registered on our network. Below is the copy of the Terms and Conditions contract you agreed to during signup.</p>
    
    <div class="warning-section">
      IMPORTANT WARNING: If you send payments to any broadcast email after we have issued a Stop Broadcast notice, we are not responsible for any lost funds.
    </div>

    <div class="terms-box">
${TERMS_AND_CONDITIONS}
    </div>

    <p style="margin-top:20px; font-size:12px;">Please store this email safely for your regulatory logs.</p>
    <div class="footer">Broadcasting Network · Security & Compliance</div>
  </div>
</body>
</html>
  `.trim();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"Broadcasting Network" <${process.env.SMTP_USER}>`,
    to,
    subject: "Broadcasting Network: Signed Terms and Conditions Contract",
    text: `Good day, ${name || "Operator"},\n\nBelow is the terms and conditions contract you agreed to:\n\n${TERMS_AND_CONDITIONS}`,
    html,
  });
}

// ─── Urgent Alert Email (Stop Broadcast Notification) ─────────────────────────
export async function sendUrgentStopBroadcastEmail(to: string, emailAddressToStop: string) {
  if (isSMTPEmpty()) {
    console.warn(`[SMTP Sandbox Warning] Stop Broadcast blast email suppressed for user: ${to}`);
    return;
  }

  const text = `
URGENT BROADCAST ALERT - PAYMENT NETWORK
--------------------------------------------------
URGENT: Anyone using ${emailAddressToStop} must stop sending payments immediately. 

Continuing after this notice is at your own risk. We are not responsible for any losses.
--------------------------------------------------
PBN System Administration
  `.trim();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>URGENT BROADCAST ALERT</title>
  <style>
    body { background: #111827; color: #f3f4f6; font-family: sans-serif; padding: 20px; }
    .box { max-width: 600px; margin: 0 auto; background: #ef4444; border-radius: 12px; padding: 4px; box-shadow: 0 0 30px rgba(239, 68, 68, 0.4); }
    .inner { background: #1e1b4b; border-radius: 10px; padding: 30px; }
    h2 { color: #ef4444; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; text-align: center; margin-top: 0; }
    .warning { border-left: 4px solid #ef4444; padding-left: 15px; margin: 25px 0; font-size: 16px; line-height: 1.6; font-weight: bold; color: #fca5a5; }
    .footer { text-align: center; font-size: 11px; margin-top: 30px; color: rgba(156, 163, 175, 0.5); text-transform: uppercase; font-family: monospace; }
  </style>
</head>
<body>
  <div class="box">
    <div class="inner">
      <h2>⚠️ URGENT STOP BROADCAST</h2>
      <div class="warning">
        URGENT: Anyone using <span style="text-decoration: underline; color: #ffffff;">${emailAddressToStop}</span> must stop sending payments immediately.
      </div>
      <p style="color: #d1d5db; line-height: 1.7;">
        Please update your local routing endpoints. Continuing to send transfers to this node after this notice is at your own risk. <strong>We are not responsible for any losses or unverified transactions.</strong>
      </p>
      <div class="footer">SYSTEM NOTICE CODE: STOP_BROADCAST_ALERT</div>
    </div>
  </div>
</body>
</html>
  `.trim();

  await transporter.sendMail({
    from: process.env.SMTP_FROM || `"URGENT ALERT | PBN" <${process.env.SMTP_USER}>`,
    to,
    subject: "URGENT: Stop Using E-Transfer Email Immediately!",
    text,
    html,
  });
}
