import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Community } from "@/models/Community";
import { Member } from "@/models/Member";
import { getUserIdFromCookie } from "@/lib/auth";
import { ErrorResponse } from "@/core/utils/responses";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const id = params.id.trim();

    // Find user ID from cookie
    const userId = await getUserIdFromCookie();
    if (!userId) return ErrorResponse("Unauthorized");

    const body = await req.json();

    await connectToDatabase();
    const community = await Community.findOne({
      slug: id.toLowerCase(),
    }).lean();
    if (!community)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const { status } = body;

    await Member.updateOne(
      { community: community?._id, user: userId },
      { $set: { status } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
