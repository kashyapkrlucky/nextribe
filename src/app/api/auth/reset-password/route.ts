import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { SendEmail } from "@/core/mailer";
import { connectToDatabase } from "@/core/config/database";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    await connectToDatabase();
    // Find user with valid reset token
    const user = await User.findOne({
      "passwordReset.token": hashedToken,
      "passwordReset.expiresAt": { $gt: new Date() }, // Token not expired
      passwordReset: { $exists: true, $ne: null },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    user.password = hashedPassword;
    user.passwordReset = {
      token: "",
      expiresAt: new Date(0), // Set to epoch to mark as used
      usedAt: new Date(),
    };

    await user.save();
    
    // Send confirmation email
    await SendEmail(user.email, "Your Folioo password has been reset", 'password-reset');

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}