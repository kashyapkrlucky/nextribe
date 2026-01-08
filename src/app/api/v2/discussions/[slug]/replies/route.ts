import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Reply } from "@/models/Reply";
import { Discussion } from "@/models/Discussion";
import mongoose from "mongoose";
import { getUserIdFromCookie } from "@/lib/auth";
import {
  BadRequestResponse,
  ErrorResponse,
  ListResponse,
} from "@/core/utils/responses";

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();
    if (!slug) {
      return BadRequestResponse("Discussion slug is required");
    }

    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit") || "20";
    const pageParam = url.searchParams.get("page") || "1";
    const limit = Math.round(parseInt(limitParam, 10));
    const page = Math.round(parseInt(pageParam, 10));

    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug });
    if (!discussion) {
      return BadRequestResponse("Discussion not found");
    }

    const query: Record<string, unknown> = { discussion: discussion._id };

    const total = await Reply.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    if (page > totalPages) {
      return ListResponse([], totalPages);
    }

    const replies = await Reply.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return ListResponse(replies, totalPages);
  } catch (e) {
    return ErrorResponse(e);
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();
    if (!slug) {
      return BadRequestResponse("Discussion slug is required");
    }

    const userId = await getUserIdFromCookie();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectToDatabase();

    const discussion = await Discussion.findOne({ slug });
    if (!discussion) return BadRequestResponse("Discussion not found");

    const bodyJson = await req.json();

    const body: string | undefined = bodyJson?.body;
    const tag: string | undefined = bodyJson?.tag;

    if (!body || body.trim().length === 0) {
      return BadRequestResponse("body is required");
    }
    if (!tag || tag.trim().length === 0) {
      return BadRequestResponse("tag is required");
    }

    const reply = await Reply.create({
      discussion: discussion._id,
      author: new mongoose.Types.ObjectId(userId),
      body,
      tag,
    });

    // Update discussion metadata
    await Discussion.updateOne(
      { _id: discussion._id },
      { $inc: { replyCount: 1 }, $set: { lastActivityAt: new Date() } }
    );

    return NextResponse.json({ reply });
  } catch (e) {
    return ErrorResponse(e);
  }
}
