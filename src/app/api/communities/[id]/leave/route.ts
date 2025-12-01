import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Community } from "@/models/Community";
import { Member } from "@/models/Member";
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
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const community = await Community.findById(id).lean();
    if (!community) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (String(community.owner) === String(userId)) {
      return NextResponse.json({ error: "Owner cannot leave their own community" }, { status: 400 });
    }

    await Member.deleteOne({ community: id, user: userId });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
