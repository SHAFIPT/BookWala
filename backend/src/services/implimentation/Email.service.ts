import nodemailer from 'nodemailer';
import { IEmailService } from '../interface/IEmailservice';

export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });
  }

  async sendOtpEmail(to: string, otp: string): Promise<void> {
    const mailOptions = {
      from: '"Your App Name" <no-reply@yourapp.com>',
      to,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}. It is valid for a limited time.`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
