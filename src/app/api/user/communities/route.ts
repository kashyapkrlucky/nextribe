import { getUserIdFromRequest } from "@/lib/auth";
import { CommunityMember } from "@/models/CommunityMember";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userId = await getUserIdFromRequest();

    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const list = await CommunityMember.aggregate([
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

    return NextResponse.json(list);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
