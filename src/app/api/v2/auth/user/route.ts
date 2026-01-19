/**
 * API route for managing user profile
 * Handles PATCH operations for updating user avatar
 * Endpoint: /api/v2/auth/user
 */
import { ErrorResponse, BadRequestResponse, UnauthorizedResponse, SuccessResponse } from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/lib/auth";
import { User } from "@/models/User";
import { connectToDatabase } from "@/core/config/database";

/**
 * Updates user profile information (currently only avatar)
 * @param req - Next.js request object containing updated user data
 * @returns Success response or error response
 */
export async function PATCH(req: Request) {
  try {
    // Authenticate user
    const userId = await getUserIdFromCookie();
    if (!userId) return UnauthorizedResponse("Authentication required");

    await connectToDatabase();
    
    // Validate user exists
    const user = await User.findById(userId);
    if (!user) return ErrorResponse("User not found");

    // Validate and extract request body
    const { avatar } = await req.json();
    
    // Validate avatar field if provided
    if (avatar !== undefined) {
      if (typeof avatar !== "string") {
        return BadRequestResponse("Avatar must be a string");
      }
      if (avatar.trim().length === 0) {
        return BadRequestResponse("Avatar cannot be empty");
      }
      user.avatar = avatar.trim();
    } else {
      return BadRequestResponse("Avatar field is required");
    }
    
    // Save updated user profile
    await user.save();
    return SuccessResponse("User profile updated successfully");
  } catch (error) {
    console.error("Error updating user profile:", error);
    return ErrorResponse("Failed to update user profile");
  }
}
