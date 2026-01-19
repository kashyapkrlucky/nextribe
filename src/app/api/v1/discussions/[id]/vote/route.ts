import { connectToDatabase } from "@/core/config/database";
import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/lib/auth";
import { Discussion } from "@/models/Discussion";
import { DiscussionVote } from "@/models/DiscussionVote";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const id = params.id.trim();

    const userId = await getUserIdFromCookie();
    if (!userId) {
      return ErrorResponse(new Error("User not authenticated"));
    }

    await connectToDatabase();

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return ErrorResponse(new Error("Discussion not found"));
    }

    const vote = new DiscussionVote({
      discussion: discussion._id,
      user: userId,
      vote: body.vote,
    });

    await vote.save();

    if (body.vote === "up") {
      discussion.upVoteCount = (discussion.upVoteCount || 0) + 1;
    } else if (body.vote === "down") {
      discussion.downVoteCount = (discussion.downVoteCount || 0) + 1;
    }

    await discussion.save();

    return SuccessResponse({ vote, id });
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
