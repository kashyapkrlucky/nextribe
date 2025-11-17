import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Reply } from "@/models/Reply";
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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const reply = await Reply.findById(id);
    if (!reply) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (String(reply.author) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await req.json();
    if (typeof json.body !== "string" || json.body.trim().length === 0) {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }

    await Reply.updateOne({ _id: id }, { $set: { body: json.body } });
    const updated = await Reply.findById(id).lean();
    return NextResponse.json({ reply: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const userId = await getUserIdFromCookie(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const reply = await Reply.findById(id);
    if (!reply) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (String(reply.author) !== String(userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await Reply.updateOne({ _id: id }, { $set: { isDeleted: true, body: "" } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
