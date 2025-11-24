import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpEmail = async (to: string, otp: string) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Verify Your Account - JIIT Portal",
    html: `
      <h1>Account Verification</h1>
      <p>Your One Time Password (OTP) for first-time login is:</p>
      <h2 style="color: #4F46E5; letter-spacing: 5px;">${otp}</h2>
      <p>This OTP expires in 10 minutes.</p>
    `,
  });
};//update styling later