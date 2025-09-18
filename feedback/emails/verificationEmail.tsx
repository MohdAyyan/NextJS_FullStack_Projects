import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Section,
  Text,
  Container,
  Body,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={{ 
        backgroundColor: '#f6f9fc', 
        padding: '40px 0',
        margin: '0',
        fontFamily: 'Roboto, Verdana, sans-serif',
      }}>
        <Container style={{ 
          margin: '0 auto',
          maxWidth: '600px',
          backgroundColor: '#ffffff', 
          borderRadius: '8px', 
          padding: '40px 20px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <Preview>Your verification code: {otp}</Preview>
          <Section>
            <Heading as="h2" style={{ 
              color: '#333',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              Hello {username}!
            </Heading>
            <Text style={{ 
              fontSize: '16px', 
              lineHeight: '24px',
              color: '#444',
              marginBottom: '24px'
            }}>
              Thank you for registering. Please use the following verification
              code to complete your registration:
            </Text>
            <Text style={{
              fontSize: '32px',
              fontWeight: 'bold',
              textAlign: 'center',
              margin: '32px 0',
              padding: '16px',
              backgroundColor: '#f3f4f6',
              borderRadius: '4px',
              letterSpacing: '4px',
              color: '#000'
            }}>
              {otp}
            </Text>
            <Text style={{ 
              fontSize: '14px', 
              color: '#666666',
              marginTop: '24px',
              fontStyle: 'italic'
            }}>
              If you did not request this code, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}