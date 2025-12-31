import { NextResponse } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";
import { SuccessResponse } from "@/core/utils/responses";
import { SendEmail } from "@/core/mailer";
import { SIGNUP_TEMPLATE } from "@/core/mailer/templates";
import { Profile } from "@/models/Profile";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const profile = await Profile.create({
      username: username,
    });

    await profile.save();

    const token = await signToken({
      sub: String(user._id),
    });

    await SendEmail(email, "Welcome to Nextribe!", 'signup');

    const res = SuccessResponse({
      user: { id: user._id, email: user.email, username: user.username },
      token,
    });
    setAuthCookie(res, token);
    return res;
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
