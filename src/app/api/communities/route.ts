import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Community } from "@/models/Community";
import { Member } from "@/models/Member";
import { jwtVerify } from "jose";
import mongoose from "mongoose";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const q = (url.searchParams.get("q") || "").trim().toLowerCase();
    const page = Math.max(parseInt(url.searchParams.get("page") || "1", 10) || 1, 1);
    const pageSize = Math.min(Math.max(parseInt(url.searchParams.get("pageSize") || "10", 10) || 10, 1), 50);
    const sort = url.searchParams.get("sort") === "popular" ? "popular" : "new";

    await connectToDatabase();

    const match: Record<string, any> = {};
    if (q) {
      match.name = { $regex: q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }

    const pipeline: any[] = [
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

    const totalCursor = await Community.aggregate([{ $match: match }, { $count: "count" }]);
    const total = totalCursor[0]?.count || 0;

    pipeline.push({ $skip: (page - 1) * pageSize }, { $limit: pageSize });

    const list = await Community.aggregate(pipeline);

    return NextResponse.json({
      communities: list,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

async function getUserIdFromCookie(request: Request): Promise<string | null> {
  try {
    const cookieHeader = request.headers.get("cookie") || "";
    const token = cookieHeader
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];
    if (!token) return null;
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;
    const key = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, key);
    const sub = payload.sub;
    if (typeof sub !== "string") return null;
    return sub;
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const name: string | undefined = body?.name;
    const providedSlug: string | undefined = body?.slug;
    const description: string | undefined = body?.description;
    const isPrivate: boolean | undefined = body?.isPrivate;
    const topicIds: string[] | undefined = body?.topicIds;

    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await connectToDatabase();

    const slug = (providedSlug && providedSlug.trim().length > 0 ? providedSlug : slugify(name)).toLowerCase();

    const existing = await Community.findOne({ slug }).lean();
    if (existing) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }

    const community = await Community.create({
      name,
      slug,
      description: description || undefined,
      owner: new mongoose.Types.ObjectId(userId),
      isPrivate: Boolean(isPrivate),
      topics: topicIds?.map(id => new mongoose.Types.ObjectId(id)) || [],
    });

    await Member.updateOne(
      { community: community._id, user: userId },
      { $setOnInsert: { role: "owner" } },
      { upsert: true }
    );

    return NextResponse.json({ community });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
