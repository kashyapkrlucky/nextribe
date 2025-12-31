import { NextResponse } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { SuccessResponse } from "@/core/utils/responses";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = await signToken({
      sub: String(user._id)
    });

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
