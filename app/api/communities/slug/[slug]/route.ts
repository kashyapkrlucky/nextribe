import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Community } from "@/models/Community";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = (params.slug || "").trim().toLowerCase();
    await connectToDatabase();
    const community = await Community.findOne({ slug }).populate("topics").lean();
    if (!community) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const url = new URL(req.url);
    const debug = url.searchParams.get("debug");
    if (debug === "1") {
      return NextResponse.json({ community, _debug: { route: "communities/slug/[slug]", slug } });
    }
    return NextResponse.json({ community });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
