import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { connectToDatabase } from "@/core/config/database";
import { getUserIdFromCookie } from "@/lib/auth";
import { Profile } from "@/models/Profile";
import { NextResponse } from "next/server";
import { User } from "@/models/User";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectToDatabase();
    const user = await User.findById(userId).lean();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const profile = await Profile.findOne({ username: user?.username }).lean();
    return SuccessResponse(profile);
  } catch (error) {
    return ErrorResponse(error as string);
  }
}

