import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { connectToDatabase } from "@/core/config/database";
import { Discussion } from "@/models/Discussion";
import { User } from "@/models/User";

export async function GET(
  _req: Request,
  context:
    | { params: { username: string } }
    | { params: Promise<{ username: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const username = params.username.trim();

    await connectToDatabase();

    const user = await User.findOne({ username }).lean();
    if (!user) return ErrorResponse("User not found");

    const list = await Discussion.find({ author: user._id }).lean();

    return SuccessResponse(list);
  } catch (e) {
    return ErrorResponse(e);
  }
}
