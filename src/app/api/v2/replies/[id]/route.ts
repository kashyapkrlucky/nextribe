/**
 * API route for managing individual replies
 * Handles PATCH (update) and DELETE operations for replies
 * Endpoint: /api/v2/replies/[id]
 */
import { NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Reply } from "@/models/Reply";
import mongoose from "mongoose";

import { getUserIdFromCookie } from "@/lib/auth";
import { BadRequestResponse, ErrorResponse, NotFoundResponse, SuccessResponse, UnauthorizedResponse } from "@/core/utils/responses";

/**
 * Extracts and validates the reply ID from route parameters
 * @param context - Route parameters containing reply ID
 * @returns Validated reply ID string
 */
async function extractAndValidateReplyId(
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
): Promise<string> {
  const params = "then" in context.params ? await context.params : context.params;
  const id = params.id.trim();
  
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid reply ID format");
  }
  
  return id;
}

/**
 * Authenticates the user and returns their ID
 * @returns Authenticated user ID
 * @throws Error if user is not authenticated
 */
async function authenticateUser(): Promise<string> {
  const userId = await getUserIdFromCookie();
  if (!userId) {
    throw new Error("Authentication required");
  }
  return userId;
}

/**
 * Fetches a reply by ID and authorizes the user
 * @param id - Reply ID
 * @param userId - User ID for authorization
 * @returns Reply document
 * @throws Error if reply not found or user not authorized
 */
async function fetchAndAuthorizeReply(id: string, userId: string) {
  await connectToDatabase();
  const reply = await Reply.findById(id);
  
  if (!reply) {
    throw new Error("Reply not found");
  }
  
  if (String(reply.author) !== String(userId)) {
    throw new Error("You are not authorized to perform this action");
  }
  
  return reply;
}

/**
 * Handles and maps errors to appropriate HTTP responses
 * @param error - The error object to handle
 * @param operation - The operation being performed (for logging)
 * @returns Appropriate HTTP response object
 */
function handleApiError(error: unknown, operation: string) {
  console.error(`Error ${operation}:`, error);
  
  if (error instanceof Error) {
    if (error.message.includes("Invalid reply ID format")) {
      return BadRequestResponse(error.message);
    }
    if (error.message.includes("Authentication required") || 
        error.message.includes("not authorized")) {
      return UnauthorizedResponse(error.message);
    }
    if (error.message.includes("Reply not found")) {
      return NotFoundResponse(error.message);
    }
  }
  
  return ErrorResponse(`Failed to ${operation}`);
}


/**
 * Updates a reply's content
 * @param req - Next.js request object containing updated reply body
 * @param context - Route parameters containing reply ID
 * @returns Updated reply object or error response
 */
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    // Extract and validate reply ID
    const id = await extractAndValidateReplyId(context);
    
    // Authenticate user
    const userId = await authenticateUser();
    
    // Fetch reply and authorize user
    await fetchAndAuthorizeReply(id, userId);

    // Validate request body
    const json = await req.json();
    if (typeof json.body !== "string" || json.body.trim().length === 0) {
      return BadRequestResponse("Reply body is required and cannot be empty");
    }

    // Update reply and return updated document
    await Reply.updateOne({ _id: id }, { $set: { body: json.body.trim() } });
    const updated = await Reply.findById(id).lean();
    return SuccessResponse({ reply: updated });
  } catch (error) {
    return handleApiError(error, "update reply");
  }
}

/**
 * Deletes a reply
 * @param req - Next.js request object
 * @param context - Route parameters containing reply ID
 * @returns Success response or error response
 */
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } } | { params: Promise<{ id: string }> }
) {
  try {
    // Extract and validate reply ID
    const id = await extractAndValidateReplyId(context);
    
    // Authenticate user
    const userId = await authenticateUser();
    
    // Fetch reply and authorize user
    const reply = await fetchAndAuthorizeReply(id, userId);
    
    // Delete the reply
    await reply.deleteOne();
    return SuccessResponse({ success: true, message: "Reply deleted successfully" });
  } catch (error) {
    return handleApiError(error, "delete reply");
  }
}
