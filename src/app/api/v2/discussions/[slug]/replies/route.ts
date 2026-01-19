/**
 * API route for managing discussion replies
 * Handles GET (list replies) and POST (create reply) operations
 * Endpoint: /api/v2/discussions/[slug]/replies
 */
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Reply } from "@/models/Reply";
import { Discussion } from "@/models/Discussion";
import mongoose from "mongoose";
import { getUserIdFromCookie } from "@/lib/auth";
import {
  BadRequestResponse,
  ErrorResponse,
  ListResponse,
  NotFoundResponse,
  SuccessResponse,
  UnauthorizedResponse,
} from "@/core/utils/responses";

/**
 * Retrieves paginated replies for a discussion
 * @param req - Next.js request object with pagination query params
 * @param context - Route parameters containing discussion slug
 * @returns Paginated list of replies or error response
 */
export async function GET(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    // Extract and validate discussion slug from params
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();
    if (!slug) {
      return BadRequestResponse("Discussion slug is required");
    }

    // Parse and validate pagination parameters
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit") || "20";
    const pageParam = url.searchParams.get("page") || "1";
    
    const limit = Math.max(1, Math.min(100, parseInt(limitParam, 10))); // Limit between 1-100
    const page = Math.max(1, parseInt(pageParam, 10));

    // Connect to database and fetch discussion
    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug });
    if (!discussion) {
      return NotFoundResponse("Discussion not found");
    }

    // Build query for replies belonging to this discussion
    const query: Record<string, unknown> = { discussion: discussion._id };
    
    // Get total count for pagination
    const total = await Reply.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    
    // Return empty list if page is beyond available content
    if (page > totalPages && totalPages > 0) {
      return ListResponse([], totalPages);
    }

    // Fetch replies with pagination and populate author details
    const replies = await Reply.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return ListResponse(replies, totalPages);
  } catch (error) {
    console.error("Error fetching discussion replies:", error);
    return ErrorResponse("Failed to fetch replies");
  }
}

/**
 * Creates a new reply for a discussion
 * Updates discussion metadata (reply count and last activity)
 * @param req - Next.js request object containing reply data
 * @param context - Route parameters containing discussion slug
 * @returns Created reply object or error response
 */
export async function POST(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    // Extract and validate discussion slug from params
    const params =
      "then" in context.params ? await context.params : context.params;
    const slug = params.slug.trim();
    if (!slug) {
      return BadRequestResponse("Discussion slug is required");
    }

    // Authenticate user
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return UnauthorizedResponse("Authentication required");
    }

    // Connect to database and fetch discussion
    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug });
    if (!discussion) return NotFoundResponse("Discussion not found");

    // Validate and extract request body
    const bodyJson = await req.json();
    const body: string | undefined = bodyJson?.body;
    const tag: string | undefined = bodyJson?.tag;

    // Validate required fields
    if (!body || typeof body !== "string" || body.trim().length === 0) {
      return BadRequestResponse("Reply body is required and cannot be empty");
    }
    if (!tag || typeof tag !== "string" || tag.trim().length === 0) {
      return BadRequestResponse("Reply tag is required and cannot be empty");
    }

    // Create new reply
    const reply = await Reply.create({
      discussion: discussion._id,
      author: new mongoose.Types.ObjectId(userId),
      body: body.trim(),
      tag: tag.trim(),
    });

    // Update discussion metadata in parallel for better performance
    await Promise.all([
      Discussion.updateOne(
        { _id: discussion._id },
        { $inc: { replyCount: 1 }, $set: { lastActivityAt: new Date() } }
      ),
      // Populate author details for the response
      Reply.findById(reply._id).populate("author", "username avatar")
    ]).then(([, populatedReply]) => {
      return populatedReply;
    });

    // Return the created reply with author details
    const populatedReply = await Reply.findById(reply._id).populate("author", "username avatar");
    return SuccessResponse({ reply: populatedReply }, "Reply created successfully");
  } catch (error) {
    console.error("Error creating reply:", error);
    return ErrorResponse("Failed to create reply");
  }
}
