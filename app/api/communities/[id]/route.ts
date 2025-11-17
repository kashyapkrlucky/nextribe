import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Community } from "@/models/Community";
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
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const item = await params;

    await connectToDatabase();
    let community:
      | Awaited<ReturnType<typeof Community.findById>>
      | Awaited<ReturnType<typeof Community.findOne>>
      | null = null;
    if (item.id) {
      community = await Community.findById(item.id).lean();
    }
    if (!community)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ community });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
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
