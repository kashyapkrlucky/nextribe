import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Discussion } from "@/models/Discussion";
import { Community } from "@/models/Community";
import mongoose from "mongoose";
import { jwtVerify } from "jose";

// Remove the RouteParams type as we'll use the direct approach

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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

export async function GET(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const id = params.id.trim();
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }
    await connectToDatabase();
    const list = await Discussion.find({ community: id })
      .sort({ lastActivityAt: -1 })
      .limit(50)
      .lean();
    return NextResponse.json({ discussions: list });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const id = params.id.trim();
    
    const userId = await getUserIdFromCookie(request);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const community = await Community.findById(id).lean();
    if (!community) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = await request.json();
    const title: string | undefined = body?.title;
    const content: string | undefined = body?.body;
    const providedSlug: string | undefined = body?.slug;

    if (!title || !content) {
      return NextResponse.json({ error: "title and body are required" }, { status: 400 });
    }

    const slug = (providedSlug && providedSlug.trim().length > 0 ? providedSlug : slugify(title)).toLowerCase();

    // Enforce unique slug within community
    const exists = await Discussion.exists({ community: id, slug });
    if (exists) {
      return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
    }

    const discussion = await Discussion.create({
      title,
      slug,
      body: content,
      author: new mongoose.Types.ObjectId(userId),
      community: new mongoose.Types.ObjectId(id),
      lastActivityAt: new Date(),
    });

    return NextResponse.json({ discussion });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
