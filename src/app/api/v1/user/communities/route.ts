import { logger } from "@/core/utils/logger";
import { ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/lib/auth";
import { Member } from "@/models/Member";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getUserIdFromCookie();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const list = await Member.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "communities",
          localField: "community",
          foreignField: "_id",
          as: "community",
        },
      },
      { $unwind: "$community" },
      {
        $project: {
          name: "$community.name",
          slug: "$community.slug",
          _id: "$community._id",
        },
      },
    ]);

    return SuccessResponse(list);
  } catch (error) {
    logger.error('Error fetching user communities:', error);
    return ErrorResponse("Internal Server Error");
  }
}
