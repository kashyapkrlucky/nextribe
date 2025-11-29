import { getUserIdFromCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Reply } from "@/models/Reply";
import { IReply } from "@/core/types/index.types";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = "then" in context.params ? await context.params : context.params;
    const id = params.id.trim();

    const userId = await getUserIdFromCookie();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const reply = await Reply.findById(id).lean() as IReply;
    if (!reply) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const json = await req.json();
    const userIdObj = new mongoose.Types.ObjectId(userId);
    
    // Initialize upVotes and downVotes arrays if they don't exist
    const upVotes = Array.isArray(reply.upVotes) ? reply.upVotes : [];
    const downVotes = Array.isArray(reply.downVotes) ? reply.downVotes : [];

    if (json.type === "up") {
      const isUpvoted = upVotes.some(id => id.equals(userIdObj));
      
      if (isUpvoted) {
        // Remove upvote
        await Reply.updateOne(
          { _id: id },
          { 
            $pull: { upVotes: userIdObj },
            $inc: { upVoteCount: -1 }
          }
        );
      } else {
        // Add upvote and remove downvote if exists
        await Reply.updateOne(
          { _id: id },
          { 
            $addToSet: { upVotes: userIdObj },
            $pull: { downVotes: userIdObj },
            $inc: { 
              upVoteCount: 1,
              downVoteCount: downVotes.some(id => id.equals(userIdObj)) ? -1 : 0
            }
          }
        );
      }
    } else if (json.type === "down") {
      const isDownvoted = downVotes.some(id => id.equals(userIdObj));
      
      if (isDownvoted) {
        // Remove downvote
        await Reply.updateOne(
          { _id: id },
          { 
            $pull: { downVotes: userIdObj },
            $inc: { downVoteCount: -1 }
          }
        );
      } else {
        // Add downvote and remove upvote if exists
        await Reply.updateOne(
          { _id: id },
          { 
            $addToSet: { downVotes: userIdObj },
            $pull: { upVotes: userIdObj },
            $inc: { 
              downVoteCount: 1,
              upVoteCount: upVotes.some(id => id.equals(userIdObj)) ? -1 : 0
            }
          }
        );
      }
    }

    // Return the updated reply
    const updatedReply = await Reply.findById(id).populate("author", "name").lean() as IReply;
    return NextResponse.json(updatedReply);
  } catch (e) {
    console.error('Vote error:', e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
