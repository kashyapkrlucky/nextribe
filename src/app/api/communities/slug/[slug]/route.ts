import { NextResponse, NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Community } from "@/models/Community";

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
    const community = await Community.findOne({ slug });
    if (!community) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ community });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
