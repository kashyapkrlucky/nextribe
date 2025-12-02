import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { Discussion } from "@/models/Discussion";

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } } | { params: Promise<{ slug: string }> }
) {
  try {
    const params = 'then' in context.params 
      ? await context.params 
      : context.params;
    const slug = (params.slug || "").trim().toLowerCase();
    await connectToDatabase();
    const discussion = await Discussion.findOne({ slug });
    if (!discussion) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(discussion);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}