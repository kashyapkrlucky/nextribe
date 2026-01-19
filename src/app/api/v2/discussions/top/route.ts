import { connectToDatabase } from "@/core/config/database";
import { Reply } from "@/models/Reply";
import { IDiscussion } from "@/core/types/index.types";
import { SuccessResponse, ErrorResponse } from "@/core/utils/responses";
import { logger } from "@/core/utils/logger";

export async function GET() {
  try {
    await connectToDatabase();

    const topDiscussions: IDiscussion[] = await Reply.aggregate([
      {
        $group: {
          _id: "$discussion",
          replies: { $push: "$_id" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $lookup: {
          from: "discussions",
          localField: "_id",
          foreignField: "_id",
          as: "discussionInfo",
        },
      },
      {
        $unwind: "$discussionInfo",
      },
      {
        $project: {
          _id: "$_id",
          title: "$discussionInfo.title",
          slug: "$discussionInfo.slug",
          replyCount: { $size: { $ifNull: ["$replies", []] } },
        },
      },
    ]);

    return SuccessResponse(topDiscussions);
  } catch (error) {
    logger.error('Error fetching top discussions:', error);
    return ErrorResponse("Internal Server Error");
  }
}
