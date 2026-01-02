import { ErrorResponse, NotFoundResponse, SuccessResponse } from "@/core/utils/responses";
import { connectToDatabase } from "@/core/config/database";
import { Profile } from "@/models/Profile";

export async function GET(
  req: Request,
  context: { params: { username: string } } | { params: Promise<{ username: string }> }) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
      
    const username = params.username.trim();
    await connectToDatabase();

    const profile = await Profile.findOne({ username }).lean();
    if (!profile)
      return NotFoundResponse("Profile not found");
    return SuccessResponse(profile);
  } catch (error) {
    return ErrorResponse(error as string);
  }
}

