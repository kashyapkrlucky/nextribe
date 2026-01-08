import { NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Discussion } from "@/models/Discussion";
import {
  BadRequestResponse,
  ErrorResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/lib/auth";
import { slugify } from "@/core/utils/helpers";

export async function GET(
  _req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();

    if (!slug) {
      return BadRequestResponse("Slug is required");
    }

    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug }).lean();
    if (!discussion) return BadRequestResponse("Discussion not found");
    return SuccessResponse(discussion);
  } catch (e) {
    console.error(e);
    return ErrorResponse("Internal Server Error");
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();

    if (!slug) {
      return BadRequestResponse("Slug is required");
    }

    const userId = await getUserIdFromCookie();
    if (!userId) return BadRequestResponse("User not found");

    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug });
    if (!discussion) return BadRequestResponse("Discussion not found");

    if (String(discussion.author) !== String(userId)) {
      return BadRequestResponse("Forbidden");
    }

    const body = await req.json();
    const updates: Partial<{ title: string; body: string; slug: string }> = {};
    if (typeof body.title === "string") {
      updates.title = body.title;
      updates.slug = slugify(body.title);
    }
    if (typeof body.body === "string") updates.body = body.body;

    // If slug changes, ensure uniqueness per community
    if (updates.slug) {
      const exists = await Discussion.exists({
        community: discussion.community,
        slug: updates.slug,
        _id: { $ne: discussion._id },
      });
      if (exists) {
        return BadRequestResponse("Slug already in use");
      }
    }

    await Discussion.updateOne({ _id: discussion._id }, { $set: updates });
    const updated = await Discussion.findById(discussion._id).lean();
    return SuccessResponse({ discussion: updated });
  } catch (e) {
    return ErrorResponse(e);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();

    if (!slug) {
      return BadRequestResponse("Slug is required");
    }

    const userId = await getUserIdFromCookie();
    if (!userId) return UnauthorizedResponse("Unauthorized");

    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug });
    if (!discussion) return BadRequestResponse("Discussion not found");
    if (String(discussion.author) !== String(userId)) {
      return BadRequestResponse("Forbidden");
    }

    await Discussion.deleteOne({ _id: discussion._id });
    return SuccessResponse({ success: true });
  } catch (e) {
    return ErrorResponse(e);
  }
}
