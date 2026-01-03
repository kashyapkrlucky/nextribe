import { ErrorResponse } from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/lib/auth";
import { User } from "@/models/User";
import { SuccessResponse } from "@/core/utils/responses";
import { connectToDatabase } from "@/core/config/database";

export async function PATCH(req: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId) return ErrorResponse("Unauthorized");

    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) return ErrorResponse("User not found");

    const { avatar } = await req.json();
    user.avatar = avatar;
    await user.save();
    return SuccessResponse("User updated successfully");
  } catch (error) {
    return ErrorResponse(error as string);
  }
}
