/**
 * API route for managing individual discussions by slug
 * Handles GET, PATCH, and DELETE operations for discussions
 * Endpoint: /api/v2/discussions/[slug]
 */
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Discussion } from "@/models/Discussion";
import {
  BadRequestResponse,
  ErrorResponse,
  NotFoundResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "@/core/utils/responses";
import { getUserIdFromCookie } from "@/lib/auth";
import { slugify } from "@/core/utils/helpers";

/**
 * Retrieves a discussion by its slug
 * @param _req - Next.js request object (not used)
 * @param context - Route parameters containing discussion slug
 * @returns Discussion object or error response
 */
export async function GET(
  _req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    // Extract and validate slug from params
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();

    if (!slug) {
      return BadRequestResponse("Discussion slug is required");
    }

    // Connect to database and fetch discussion
    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug }).lean();
    if (!discussion) return NotFoundResponse("Discussion not found");
    
    return SuccessResponse(discussion);
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return ErrorResponse("Failed to fetch discussion");
  }
}

/**
 * Updates a discussion's content (title and/or body)
 * Automatically updates slug if title is changed
 * @param req - Next.js request object containing updated discussion data
 * @param context - Route parameters containing discussion slug
 * @returns Updated discussion object or error response
 */
export async function PATCH(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    // Extract and validate slug from params
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();

    if (!slug) {
      return BadRequestResponse("Discussion slug is required");
    }

    // Authenticate user
    const userId = await getUserIdFromCookie();
    if (!userId) return UnauthorizedResponse("Authentication required");

    // Connect to database and fetch discussion
    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug });
    if (!discussion) return NotFoundResponse("Discussion not found");

    // Authorize user (only discussion author can update)
    if (String(discussion.author) !== String(userId)) {
      return UnauthorizedResponse("You are not authorized to update this discussion");
    }

    // Validate and extract update data
    const body = await req.json();
    const updates: Partial<{ title: string; body: string; slug: string }> = {};
    
    if (typeof body.title === "string") {
      const trimmedTitle = body.title.trim();
      if (trimmedTitle.length === 0) {
        return BadRequestResponse("Title cannot be empty");
      }
      updates.title = trimmedTitle;
      updates.slug = slugify(trimmedTitle);
    }
    
    if (typeof body.body === "string") {
      const trimmedBody = body.body.trim();
      if (trimmedBody.length === 0) {
        return BadRequestResponse("Body cannot be empty");
      }
      updates.body = trimmedBody;
    }

    // Validate that at least one field is being updated
    if (Object.keys(updates).length === 0) {
      return BadRequestResponse("At least one field (title or body) must be provided");
    }

    // If slug changes, ensure uniqueness within the same community
    if (updates.slug && updates.slug !== discussion.slug) {
      const exists = await Discussion.exists({
        community: discussion.community,
        slug: updates.slug,
        _id: { $ne: discussion._id },
      });
      if (exists) {
        return BadRequestResponse("A discussion with this title already exists in the community");
      }
    }

    // Apply updates and return updated document
    await Discussion.updateOne({ _id: discussion._id }, { $set: updates });
    const updated = await Discussion.findById(discussion._id).lean();
    return SuccessResponse({ discussion: updated });
  } catch (error) {
    console.error("Error updating discussion:", error);
    return ErrorResponse("Failed to update discussion");
  }
}

/**
 * Deletes a discussion
 * @param req - Next.js request object
 * @param context - Route parameters containing discussion slug
 * @returns Success response or error response
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    // Extract and validate slug from params
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();

    if (!slug) {
      return BadRequestResponse("Discussion slug is required");
    }

    // Authenticate user
    const userId = await getUserIdFromCookie();
    if (!userId) return UnauthorizedResponse("Authentication required");

    // Connect to database and fetch discussion
    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug });
    if (!discussion) return NotFoundResponse("Discussion not found");
    
    // Authorize user (only discussion author can delete)
    if (String(discussion.author) !== String(userId)) {
      return UnauthorizedResponse("You are not authorized to delete this discussion");
    }

    // Delete the discussion
    await Discussion.deleteOne({ _id: discussion._id });
    return SuccessResponse({ success: true, message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return ErrorResponse("Failed to delete discussion");
  }
}
