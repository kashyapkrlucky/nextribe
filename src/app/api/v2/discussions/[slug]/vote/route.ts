import { connectToDatabase } from "@/core/config/database";
import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/lib/auth";
import { Discussion } from "@/models/Discussion";
import { DiscussionVote } from "@/models/DiscussionVote";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    const body = await req.json();
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();

    if (!slug) {
      return ErrorResponse(new Error("Slug is required"));
    }

    const userId = await getUserIdFromCookie();
    if (!userId) {
      return ErrorResponse(new Error("User not authenticated"));
    }

    await connectToDatabase();

    const discussion = await Discussion.findOne({ slug }).populate("author", "username email").populate("community", "name");
    if (!discussion) {
      return ErrorResponse(new Error("Discussion not found"));
    }

    const voteExists = await DiscussionVote.findOne({
      discussion: discussion._id,
      user: userId,
    })

    let vote;
    if (voteExists) {
      if (body.vote === "up") {
        if (voteExists?.vote === "down") {
          discussion.downVoteCount = (discussion.downVoteCount || 0) - 1;
          discussion.upVoteCount = (discussion.upVoteCount || 0) + 1;
        } else if (voteExists?.vote === "up") {
          // Already upvoted, do nothing
        }
      } else if (body.vote === "down") {
        if (voteExists?.vote === "up") {
          discussion.upVoteCount = (discussion.upVoteCount || 0) - 1;
          discussion.downVoteCount = (discussion.downVoteCount || 0) + 1;
        } else if (voteExists?.vote === "down") {
          // Already downvoted, do nothing
        }
      }
      voteExists.vote = body.vote;
      await voteExists.save();
    } else {
      if (body.vote === "up") {
        discussion.upVoteCount = (discussion.upVoteCount || 0) + 1;
      } else if (body.vote === "down") {
        discussion.downVoteCount = (discussion.downVoteCount || 0) + 1;
      }
      vote = new DiscussionVote({
        discussion: discussion._id,
        user: userId,
        vote: body.vote,
      });
      await vote.save();
    }

    await discussion.save();

    return SuccessResponse(discussion);
  } catch (error) {
    return ErrorResponse(error as Error);
  }
}
