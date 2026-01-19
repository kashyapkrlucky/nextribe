import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Discussion } from "@/models/Discussion";
import mongoose from "mongoose";

export async function GET(
  _request: NextRequest,
  context: { params: { id: string; slug: string } } | { params: Promise<{ id: string; slug: string }> }
) {
  try {
    const params = 'then' in context.params ? await context.params : context.params;
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
