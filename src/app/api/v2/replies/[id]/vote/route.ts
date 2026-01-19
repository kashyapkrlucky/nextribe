/**
 * API route for managing reply votes
 * Handles PATCH operations for voting on replies
 * Endpoint: /api/v2/replies/[id]/vote
 */
import { getUserIdFromCookie } from "@/lib/auth";
import { connectToDatabase } from "@/core/config/database";
import { Reply } from "@/models/Reply";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { ReplyVote } from "@/models/ReplyVote";
import {
  BadRequestResponse,
  ErrorResponse,
  NotFoundResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "@/core/utils/responses";

/**
 * Handles voting on a reply (upvote or downvote)
 * Supports both new votes and changing existing votes
 * @param req - Next.js request object containing vote type ('up' or 'down')
 * @param context - Route parameters containing reply ID
 * @returns Updated reply with vote counts or error response
 */
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> },
) {
  try {
    // Extract and validate reply ID from params
    const params =
      "then" in context.params ? await context.params : context.params;
    const id = params.id.trim();

    // Authenticate user
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return UnauthorizedResponse(
        "You are not authorized to perform this action",
      );
    }
    
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return BadRequestResponse("Invalid reply ID format");
    }

    // Connect to database and fetch reply with author details
    await connectToDatabase();
    const reply = await Reply.findById(id).populate(
      "author",
      "username avatar",
    );
    if (!reply) {
      return NotFoundResponse("Reply not found");
    }

    // Validate request body
    const body = await req.json();
    if (!body.vote || (body.vote !== "up" && body.vote !== "down")) {
      return BadRequestResponse("Vote must be either 'up' or 'down'");
    }

    // Check if user has already voted on this reply
    const voteExists = await ReplyVote.findOne({
      reply: id,
      user: userId,
    });

    // Initialize vote counts if they don't exist
    if (!reply.upVoteCount) reply.upVoteCount = 0;
    if (!reply.downVoteCount) reply.downVoteCount = 0;

    // Handle vote logic - either update existing vote or create new one
    if (voteExists) {
      // User is changing their vote
      if (body.vote === "up") {
        if (voteExists.vote === "down") {
          // Changing from downvote to upvote
          reply.downVoteCount -= 1;
          reply.upVoteCount += 1;
        }
        // If already upvoted, do nothing (idempotent operation)
      } else if (body.vote === "down") {
        if (voteExists.vote === "up") {
          // Changing from upvote to downvote
          reply.upVoteCount -= 1;
          reply.downVoteCount += 1;
        }
        // If already downvoted, do nothing (idempotent operation)
      }
      
      // Update the existing vote record
      voteExists.vote = body.vote;
      await voteExists.save();
    } else {
      // User is voting for the first time
      if (body.vote === "up") {
        reply.upVoteCount += 1;
      } else if (body.vote === "down") {
        reply.downVoteCount += 1;
      }
      
      // Create new vote record
      const vote = new ReplyVote({
        reply: reply._id,
        user: userId,
        vote: body.vote,
      });
      await vote.save();
    }

    // Save updated vote counts on reply
    await reply.save();
    return SuccessResponse(reply);
  } catch (error) {
    console.error("Vote error:", error);
    return ErrorResponse("Failed to process vote");
  }
}
