import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import crypto from "crypto";
import { connectToDatabase } from "@/core/config/database";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
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
      passwordReset: { $exists: true, $ne: null }, // Password reset object exists
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}