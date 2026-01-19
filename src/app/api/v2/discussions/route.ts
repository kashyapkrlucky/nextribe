/**
 * API route for managing discussions
 * Handles POST (create discussion) and GET (list discussions) operations
 * Endpoint: /api/v2/discussions
 */
import { getUserIdFromCookie } from "@/lib/auth";
import { connectToDatabase } from "@/core/config/database";
import { Discussion } from "@/models/Discussion";
import { NextRequest } from "next/server";
import { slugify } from "@/core/utils/helpers";

// Make sure models are registered
import "@/models/User";
import "@/models/Community";
import { User } from "@/models/User";
import { SuccessResponse } from "@/core/utils/responses";
import { logger } from "@/core/utils/logger";
import { ErrorResponse, BadRequestResponse, UnauthorizedResponse } from "@/core/utils/responses";

/**
 * Creates a new discussion
 * Automatically generates slug from title if not provided
 * @param req - Next.js request object containing discussion data
 * @returns Created discussion ID or error response
 */
export async function POST(req: NextRequest) {
  try {
    // Validate and extract request body
    const body = await req.json();
    
    // Authenticate user
    const userId = await getUserIdFromCookie();
    if (!userId) {
      return UnauthorizedResponse("Authentication required");
    }
    
    await connectToDatabase();

    // Validate user exists
    const user = await User.findById(userId).select("_id");
    if (!user) {
      return ErrorResponse("User not found");
    }
    
    // Validate required fields
    if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
      return BadRequestResponse("Discussion title is required and cannot be empty");
    }
    if (!body.body || typeof body.body !== "string" || body.body.trim().length === 0) {
      return BadRequestResponse("Discussion body is required and cannot be empty");
    }
    if (!body.community || typeof body.community !== "string") {
      return BadRequestResponse("Community ID is required");
    }
    
    // Generate slug from title if not provided
    const slug = body.slug || slugify(body.title.trim());
    
    // Check for slug uniqueness within the community
    const existingDiscussion = await Discussion.findOne({
      community: body.community,
      slug: slug
    });
    if (existingDiscussion) {
      return BadRequestResponse("A discussion with this title already exists in the community");
    }
    
    // Create discussion object
    const discussion = {
      title: body.title.trim(),
      body: body.body.trim(),
      slug: slug,
      community: body.community,
      author: userId,
    };
    
    const item = await Discussion.create(discussion);
    logger.info("Discussion created successfully", { discussionId: item._id, author: userId });

    return SuccessResponse(
      item.toObject()._id,
      "Discussion created successfully"
    );
  } catch (error) {
    logger.error("Error creating discussion:", error);
    return ErrorResponse("Failed to create discussion");
  }
}

/**
 * Retrieves paginated list of discussions
 * Supports filtering by feed type (recent or top)
 * @param req - Request object with pagination and filter query params
 * @returns Paginated list of discussions or error response
 */
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);

    // Parse and validate pagination parameters
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const pageSize = Math.max(1, Math.min(50, parseInt(url.searchParams.get("pageSize") || "20", 10))); // Limit between 1-50
    const feedType = url.searchParams.get("feedType") || "recent";
    
    // Validate feed type
    if (!["recent", "top"].includes(feedType)) {
      return BadRequestResponse("Invalid feed type. Must be 'recent' or 'top'");
    }
    
    // Get total count for pagination
    const total = await Discussion.countDocuments();
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    // Build base query
    let discussionsQuery = Discussion.find();

    // Apply sorting based on feed type
    if (feedType === "top") {
      discussionsQuery = discussionsQuery.sort({ replyCount: -1, createdAt: -1 });
    } else if (feedType === "recent") {
      discussionsQuery = discussionsQuery.sort({ createdAt: -1 });
    }
    
    // Execute query with pagination and populate related data
    const discussions = await discussionsQuery
      .populate({
        path: "author",
        select: "username avatar",
        model: "User",
      })
      .populate({
        path: "community",
        select: "name slug",
        model: "Community",
      })
      .limit(pageSize)
      .skip((page - 1) * pageSize)
      .lean()
      .exec();

    return SuccessResponse({
      discussions,
      pagination: {
        page,
        pageSize,
        totalPages,
        total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    logger.error("Error getting discussions:", error);
    return ErrorResponse("Failed to fetch discussions");
  }
}
