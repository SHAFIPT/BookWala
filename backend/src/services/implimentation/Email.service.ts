import nodemailer from 'nodemailer';
import { IEmailService } from '../interface/IEmailservice';

export class EmailService implements IEmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
    });    
  }

  async sendOtpEmail(email: string, otp: string): Promise<boolean> {
    try {
      const mailOptions = {
      from: process.env.EMAIL_USER,
      to : email,
      subject: 'Your OTP Code',
      text: `Your OTP is: ${otp}. It is valid for a limited time.`,
    };
      const info = await this.transporter.sendMail(mailOptions)
      console.log('Email sent: ' + info.response)
        return true;

    } catch (error) {
       console.error('Error sending email:', error);
        return false
    }
  }
}
