import { NextResponse } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";
import { SuccessResponse } from "@/core/utils/responses";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
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
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = await signToken({
      sub: String(user._id),
      email: user.email,
      name: user.name,
    });

    const res = SuccessResponse({
      user: { id: user._id, email: user.email, name: user.name },
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
