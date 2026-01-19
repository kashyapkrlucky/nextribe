import { ErrorResponse } from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/lib/auth";
import { Profile } from "@/models/Profile";
import { User } from "@/models/User";
import { SuccessResponse } from "@/core/utils/responses";
import { connectToDatabase } from "@/core/config/database";

export async function PATCH(req: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId)
      return ErrorResponse("Unauthorized");

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user)
      return ErrorResponse("User not found");

    const profile = await Profile.findOne({ username: user.username });
    if (!profile)
      return ErrorResponse("Profile not found");
    
    const body = await req.json();

    // cant update username
    delete body.username;
    await Profile.updateOne({ username: user.username }, { $set: body });
    return SuccessResponse("Profile updated successfully");
    
  } catch (error) {
    return ErrorResponse(error as string);
  }
}
