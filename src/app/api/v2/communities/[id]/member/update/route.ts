import { NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Community } from "@/models/Community";
import { Member } from "@/models/Member";
import { getUserIdFromCookie } from "@/lib/auth";
import { ErrorResponse, NotFoundResponse, SuccessResponse } from "@/core/utils/responses";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> },
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
    });
    if (!community) return NotFoundResponse("Community not found");

    const { status } = body;

    await Member.updateOne(
      { community: community?._id, user: userId },
      { $set: { status } },
      { upsert: true },
    );    

    const memberCount = await Member.countDocuments({
      community: community._id,
      status: "active",
    });

    const member = await Member.findOne({
      community: community._id,
      user: userId,
    });
    community.memberCount = memberCount;
    await community.save();

    return SuccessResponse({ ...community.toObject(), member });
  } catch (e) {
    console.error(e);
    return ErrorResponse("Internal Server Error");
  }
}
