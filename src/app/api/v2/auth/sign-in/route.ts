import { connectToDatabase } from "@/core/config/database";
import { User } from "@/models/User";
import { signToken, setAuthCookie } from "@/lib/auth";
import { BadRequestResponse, ErrorResponse, SuccessResponse, UnauthorizedResponse } from "@/core/utils/responses";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return BadRequestResponse("Missing credentials");
    }

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return UnauthorizedResponse("Invalid email or password");
    }

    const ok = await user.comparePassword(password);
    if (!ok) {
      return UnauthorizedResponse("Invalid email or password");
    }

    const token = await signToken({
      sub: String(user._id)
    });

    const res = SuccessResponse({
      user: { id: user._id, email: user.email, username: user.username, avatar: user.avatar },
      token,
    });
    setAuthCookie(res, token);
    return res;
  } catch (e) {
    return ErrorResponse(e as Error);
  }
}
