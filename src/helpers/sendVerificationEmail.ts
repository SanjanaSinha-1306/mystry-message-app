import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '../types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string, 
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // 1. Create the Gmail transporter using environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, //  Gmail address
        pass: process.env.GMAIL_PASS, 
      },
    });

    // 2. Convert your existing React template into HTML text
    const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));

    // 3. Configure the mail options
    const mailOptions = {
      from: `"Mystery Message" <${process.env.GMAIL_USER}>`,
      to: email, 
      subject: 'Mystery Message | Verify your email',
      html: emailHtml, 
    };

    // 4. Send the email via Gmail
    await transporter.sendMail(mailOptions);

    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email' };
  }
}