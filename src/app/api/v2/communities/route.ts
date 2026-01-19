import { connectToDatabase } from "@/core/config/database";
import { Community } from "@/models/Community";
import { Member } from "@/models/Member";
import mongoose, { PipelineStage } from "mongoose";
import { BadRequestResponse, ErrorResponse, SuccessResponse } from "@/core/utils/responses";
import { slugify } from "@/core/utils/helpers";
import { logger } from "@/core/utils/logger";
import { getUserIdFromCookie } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();
    const page = Math.max(
      parseInt(url.searchParams.get("page") || "1", 10) || 1,
      1
    );
    const pageSize = Math.min(
      Math.max(parseInt(url.searchParams.get("pageSize") || "10", 10) || 10, 1),
      50
    );
    const sort = url.searchParams.get("sort") === "popular" ? "popular" : "new";

    await connectToDatabase();

    const match: Record<string, unknown> = {};
    if (q) {
      match.name = {
        $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $lookup: {
          from: "members",
          localField: "_id",
          foreignField: "community",
          as: "_members",
        },
      },
      { $addFields: { membersCount: { $size: "$_members" } } },
      { $project: { _members: 0 } },
    ];

    if (sort === "popular") {
      pipeline.push({ $sort: { membersCount: -1, createdAt: -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    const totalCursor = await Community.aggregate([
      { $match: match },
      { $count: "count" },
    ]);
    const total = totalCursor[0]?.count || 0;

    pipeline.push({ $skip: (page - 1) * pageSize }, { $limit: pageSize });

    const list = await Community.aggregate(pipeline);

    return SuccessResponse({
      communities: list,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    logger.error('Error fetching communities:', error);
    return ErrorResponse(error as Error);
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromCookie();
    if (!userId)
      return BadRequestResponse("Unauthorized");

    const body = await req.json();
    const name: string | undefined = body?.name;
    const description: string | undefined = body?.description;
    const isPrivate: boolean | undefined = body?.isPrivate;
    const topicIds: string[] | undefined = body?.topicIds;
    const guidelines: string[] | undefined = body?.guidelines;

    if (!name || name.trim().length === 0) {
      return BadRequestResponse("Name is required");
    }

    await connectToDatabase();

    const slug = slugify(name).toLowerCase();

    const existing = await Community.findOne({ slug }).lean();
    if (existing) {
      return BadRequestResponse("Slug already in use");
    }

    const community = await Community.create({
      name,
      slug,
      description: description || undefined,
      owner: new mongoose.Types.ObjectId(userId),
      isPrivate: Boolean(isPrivate),
      topics: topicIds?.map((id) => new mongoose.Types.ObjectId(id)) || [],
      guidelines: guidelines?.length ? guidelines : undefined,
    });

    await Member.updateOne(
      { community: community._id, user: userId },
      { $setOnInsert: { role: "owner" } },
      { upsert: true }
    );

    community.memberCount = 1;
    await community.save();

    return SuccessResponse({ slug: community.slug });
  } catch (error) {
    logger.error('Error creating community:', error);
    return ErrorResponse(error as Error);
  }
}
