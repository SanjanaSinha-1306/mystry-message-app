import { resend } from '@/src/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '../types/ApiResponse';
import { render } from '@react-email/render'; //

export async function sendVerificationEmail(
  email: string,
  username: string, 
  verifyCode: string
): Promise<ApiResponse> {
  try {
    // This turns your React template into HTML text
    const emailHtml = await render(VerificationEmail({ username, otp: verifyCode }));

    await resend.emails.send({
      from: 'onboarding@resend.dev', // Default for accounts without a domain
      to: email, // REMEMBER: This must be YOUR Resend account email for now
      subject: 'Mystery Message | Verify your email',
      html: emailHtml, 
    });

    return { success: true, message: 'Verification email sent successfully' };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, message: 'Failed to send verification email' };
  }
}