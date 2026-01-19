import { NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Community } from "@/models/Community";
import { Discussion } from "@/models/Discussion";
import { ErrorResponse, NotFoundResponse, SuccessResponse } from "@/core/utils/responses";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> },
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const id = params.id.trim();

    const community = await Community.findOne({ slug: id }).lean();

    if (!community) {
      return NotFoundResponse("Community not found");
    }

    await connectToDatabase();
    const list = await Discussion.find({ community: community._id })
      .sort({ repliesCount: -1 })
      .limit(50)
      .lean();
    return SuccessResponse(list);
  } catch (e) {
    console.error(e);
    return ErrorResponse("Internal Server Error");
  }
}
