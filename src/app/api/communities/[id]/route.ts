import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Community } from "@/models/Community";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
import { jwtVerify } from "jose";

// Ensure Topic model is registered
if (!mongoose.models.Topic) {
  mongoose.model("Topic", Topic.schema);
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
  req: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
      
    const id = params.id.trim();
    
    await connectToDatabase();
    
    // First try to find by ID if it looks like an ObjectId
    let community = await Community.findById(id).lean();
    
    // If not found by ID, try by slug
    if (!community) {
      community = await Community.findOne({ slug: id.toLowerCase() }).lean();
    }
    
    if (!community) {
      return NextResponse.json({ error: "Community not found" }, { status: 404 });
    }
    
    
    return NextResponse.json({ community });
  } catch (error) {
    console.error('Error in GET /api/communities/[id]:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
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

    const userId = await getUserIdFromCookie(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const community = await Community.findById(id);
    if (!community)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (String(community.owner) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const updates: Partial<{
      name: string;
      description: string;
      isPrivate: boolean;
    }> = {};
    if (typeof body.name === "string") updates.name = body.name;
    if (typeof body.description === "string")
      updates.description = body.description;
    if (typeof body.isPrivate === "boolean") updates.isPrivate = body.isPrivate;

    await Community.updateOne({ _id: id }, { $set: updates });
    const updated = await Community.findById(id).lean();
    return NextResponse.json({ community: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
