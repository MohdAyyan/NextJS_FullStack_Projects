import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
   
    await resend.emails.send({
      from: "<onboarding@resend.dev>",
      to: email,
      subject: "Verify your email address",
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      status: 200,
      message: "Verification email sent successfully",
    };
  } catch (error) {
    console.log("Error sending verification email", error);
    return {
      success: false,
      status: 500,
      message: "Error sending verification email",
    };
  }
}
