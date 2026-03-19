import{
  Html,
  Head,
  Preview,
  Font,
  Heading,
  Text,
 
} from '@react-email/components';

interface VerificationEmailProps{
  username:string;
  otp:string;
}
export default function VerificationEmail({username,otp}:VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your email</Preview>
      <Font
        fontFamily="Roboto"
        fallbackFontFamily="Verdana"
      />
      <Heading>Verify your email</Heading>
      <Text>
        Hi {username},
      </Text>
      <Text>
        Your verification code is: {otp}
      </Text>
    </Html>
  );
}