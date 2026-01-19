import { connectToDatabase } from "@/core/config/database";
import { Topic } from "@/models/Topic";
import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";

export async function GET() {
  try {
    await connectToDatabase();
    const items = await Topic.find({ isArchived: false }).select(
      "name slug createdAt",
    );
    return SuccessResponse(items);
  } catch (error) {
    return ErrorResponse(error);
  }
}
