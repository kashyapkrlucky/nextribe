import { connectToDatabase } from "@/core/config/database";
import { SendEmail } from "@/core/mailer";
import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { User } from "@/models/User";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return ErrorResponse("Email is required");
    }
    await connectToDatabase();
    const user = await User.findOne({ email }).select("_id email");
    if (!user) {
      return ErrorResponse("User not found");
    }
    const resetToken = await user.createPasswordResetToken();
    if (!resetToken) {
      return ErrorResponse("Failed to generate reset token");
    }
    console.log("Generated reset token:", resetToken);
    
    await SendEmail(user.email, "Reset your password", "forgot-password", resetToken);
    return SuccessResponse("Password reset email sent");
  } catch (error) {
    console.error("Error in forgot password:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return ErrorResponse(errorMessage);
  }
}


