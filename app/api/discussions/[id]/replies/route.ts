import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reply } from "@/models/Reply";
import { Discussion } from "@/models/Discussion";
import mongoose from "mongoose";
import { jwtVerify } from "jose";

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

export async function GET(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const id = params.id.trim();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid discussion id" }, { status: 400 });
    }

    const url = new URL(req.url);
    const parent = url.searchParams.get("parent");
    const limitParam = url.searchParams.get("limit");
    const limit = Math.min(Math.max(parseInt(limitParam || "50", 10) || 50, 1), 100);

    await connectToDatabase();

    const query: Record<string, unknown> = { discussion: id };
    if (parent) {
      if (!mongoose.Types.ObjectId.isValid(parent)) {
        return NextResponse.json({ error: "Invalid parent id" }, { status: 400 });
      }
      query.parent = new mongoose.Types.ObjectId(parent);
    } else {
      query.parent = null;
    }

    const replies = await Reply.find(query)
      .sort({ createdAt: 1 })
      .limit(limit)
      .lean();

    return NextResponse.json({ replies });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const id = params.id.trim();

    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid discussion id" }, { status: 400 });
    }

    await connectToDatabase();

    const discussion = await Discussion.findById(id);
    if (!discussion) return NextResponse.json({ error: "Discussion not found" }, { status: 404 });

    const bodyJson = await req.json();
    const body: string | undefined = bodyJson?.body;
    const parent: string | undefined = bodyJson?.parent || undefined;

    if (!body || body.trim().length === 0) {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }

    let parentId: mongoose.Types.ObjectId | null = null;
    if (parent) {
      if (!mongoose.Types.ObjectId.isValid(parent)) {
        return NextResponse.json({ error: "Invalid parent id" }, { status: 400 });
      }
      parentId = new mongoose.Types.ObjectId(parent);
      // Ensure parent exists and belongs to same discussion
      const parentDoc = await Reply.findOne({ _id: parentId, discussion: id }).select({ _id: 1 }).lean();
      if (!parentDoc) {
        return NextResponse.json({ error: "Parent reply not found in this discussion" }, { status: 400 });
      }
    }

    const reply = await Reply.create({
      discussion: new mongoose.Types.ObjectId(id),
      author: new mongoose.Types.ObjectId(userId),
      body,
      parent: parentId,
    });

    // Update discussion metadata
    await Discussion.updateOne(
      { _id: id },
      { $inc: { commentCount: 1 }, $set: { lastActivityAt: new Date() } }
    );

    return NextResponse.json({ reply });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
