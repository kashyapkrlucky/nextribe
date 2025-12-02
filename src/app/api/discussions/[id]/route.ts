import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Discussion } from "@/models/Discussion";
import mongoose from "mongoose";
import { getUserIdFromCookie } from "@/lib/auth";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(
  _req: NextRequest,
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
    const discussion = await Discussion.findById(id).lean();
    if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ discussion });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const id = params.id.trim();

    const userId = await getUserIdFromCookie();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const discussion = await Discussion.findById(id);
    if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (String(discussion.author) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updates: Partial<{ title: string; body: string; slug: string }> = {};
    if (typeof body.title === "string") {
      updates.title = body.title;
      updates.slug = slugify(body.title);
    }
    if (typeof body.body === "string") updates.body = body.body;

    // If slug changes, ensure uniqueness per community
    if (updates.slug) {
      const exists = await Discussion.exists({ community: discussion.community, slug: updates.slug, _id: { $ne: discussion._id } });
      if (exists) {
        return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
      }
    }

    await Discussion.updateOne({ _id: id }, { $set: updates });
    const updated = await Discussion.findById(id).lean();
    return NextResponse.json({ discussion: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const id = params.id.trim();

    const userId = await getUserIdFromCookie();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const discussion = await Discussion.findById(id);
    if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (String(discussion.author) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Discussion.deleteOne({ _id: id });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
