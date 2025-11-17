import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Discussion } from "@/models/Discussion";
import mongoose from "mongoose";

export async function GET(_req: Request, { params }: { params: { id: string; slug: string } }) {
  try {
    const { id, slug } = params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid community id" }, { status: 400 });
    }
    await connectToDatabase();
    const discussion = await Discussion.findOne({ community: id, slug }).lean();
    if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ discussion });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
