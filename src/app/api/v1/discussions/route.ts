import { getUserIdFromCookie } from "@/lib/auth";
import { connectToDatabase } from "@/core/config/database";
import { Discussion } from "@/models/Discussion";
import { NextRequest } from "next/server";

// Make sure models are registered
import "@/models/User";
import "@/models/Community";
import { User } from "@/models/User";
import { SuccessResponse } from "@/core/utils/responses";
import { logger } from "@/core/utils/logger";
import { ErrorResponse } from "@/core/utils/responses";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return ErrorResponse("Unauthorized");
    }
    await connectToDatabase();

    const user = await User.findById(userId).select("_id");
    if (!user) {
      return ErrorResponse("User not found");
    }
    const discussion = {
      title: body.title,
      body: body.body,
      slug: body.slug || undefined,
      community: body.community,
      author: userId,
    };
    const item = await Discussion.create(discussion);

    return SuccessResponse(
      item.toObject()._id,
      "Discussion created successfully"
    );
  } catch (error) {
    logger.error("Error creating discussion:", error);
    return ErrorResponse("Internal Server Error");
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);

    const page = parseInt(url.searchParams.get("page") || "1", 10) || 1;
    const pageSize =
      parseInt(url.searchParams.get("pageSize") || "20", 10) || 20;
    const feedType = url.searchParams.get("feedType") || "recent";
    const total = await Discussion.countDocuments();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const discussionsQuery = Discussion.find();

    if (feedType === "top") {
      discussionsQuery.sort({ repliesCount: -1 });
    } else if (feedType === "recent") {
      discussionsQuery.sort({ createdAt: -1 });
    }
    const discussions = await discussionsQuery
      .populate({
        path: "author",
        select: "username email",
        model: "User",
      })
      .populate({
        path: "community",
        select: "name slug",
        model: "Community",
      })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean()
      .exec();

    return SuccessResponse({
      discussions,
      page,
      pageSize,
      totalPages,
    });
  } catch (error) {
    logger.error("Error getting discussions:", error);
    return ErrorResponse("Internal Server Error");
  }
}
