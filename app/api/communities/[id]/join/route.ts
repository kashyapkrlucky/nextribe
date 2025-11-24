import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Community } from "@/models/Community";
import { CommunityMember } from "@/models/CommunityMember";
import mongoose from "mongoose";
import { getUserIdFromRequest } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const id = params.id.trim();

    const userId = await getUserIdFromRequest();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const community = await Community.findById(id).lean();
    if (!community) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await CommunityMember.updateOne(
      { community: id, user: userId },
      { $setOnInsert: { role: "member" } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
