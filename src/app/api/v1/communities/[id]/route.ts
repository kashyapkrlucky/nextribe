import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Community } from "@/models/Community";
import { Topic } from "@/models/Topic";
import mongoose from "mongoose";
// import { jwtVerify } from "jose";
import { getUserIdFromCookie } from "@/lib/auth";
import { Member } from "@/models/Member";
import { BadRequestResponse, ErrorResponse, SuccessResponse } from "@/core/utils/responses";

// Ensure Topic model is registered
if (!mongoose.models.Topic) {
  mongoose.model("Topic", Topic.schema);
}

export async function GET(
  req: Request,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;

    const id = params.id.trim();

    // Find user ID from cookie
    const userId = await getUserIdFromCookie();
    if (!userId)
      return ErrorResponse("Unauthorized");

    // Connect to database
    await connectToDatabase();
    // Find community by slug
    const community = await Community.findOne({
      slug: id.toLowerCase(),
    }).populate("topics", "slug name").lean();

    if (!community) {
      return BadRequestResponse("Community not found");
    }

    const member = await Member.findOne({
      user: userId,
      community: community._id,
    }).lean();

    return SuccessResponse({
      ...community,
      memberRole: member?.role || null,
      isMember: member?.status === 'active',
    });
  } catch (error) {
    console.error("Error in GET /api/communities/[id]:", error);
    return ErrorResponse("Internal Server Error");
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const id = params.id.trim();

    const userId = await getUserIdFromCookie();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    await connectToDatabase();
    const community = await Community.findById(id);
    if (!community)
      return ErrorResponse("Not found");

    if (String(community.owner) !== String(userId)) {
      return ErrorResponse("Forbidden");
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
    return SuccessResponse({ community: updated });
  } catch (e) {
    console.error(e);
    return ErrorResponse("Internal Server Error");
  }
}
