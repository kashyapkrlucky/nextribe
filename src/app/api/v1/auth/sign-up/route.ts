import { connectToDatabase } from "@/core/config/database";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken, setAuthCookie } from "@/lib/auth";
import { BadRequestResponse, ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { SendEmail } from "@/core/mailer";
import { Profile } from "@/models/Profile";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return BadRequestResponse("Missing required fields");
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: email.toLowerCase() }).lean();
    if (existing) {
      return BadRequestResponse("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const profile = await Profile.create({
      user: user._id,
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
    return ErrorResponse(e as Error);
  }
}
