import { connectToDatabase } from "@/core/config/database";
import { logger } from "@/core/utils/logger";
import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { Member } from "@/models/Member";

export async function GET() {
  try {
    await connectToDatabase();
    const topCommunities = await Member.aggregate([
      {
        $group: {
          _id: "$community",
          memberCount: { $sum: 1 },
        },
      },
      {
        $sort: { memberCount: -1 },
      },
      {
        $limit: 5,
      },
      {
        $lookup: {
          from: "communities",
          localField: "_id",
          foreignField: "_id",
          as: "communityInfo",
        },
      },
      {
        $unwind: "$communityInfo",
      },
      {
        $project: {
          _id: "$_id",
          name: "$communityInfo.name",
          slug: "$communityInfo.slug",
          memberCount: 1,
        },
      },
    ]);

    return SuccessResponse(topCommunities);
  } catch (error) {
    logger.error('Error fetching top communities:', error);
    return ErrorResponse("Internal Server Error");
  }
}
