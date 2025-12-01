import { connectToDatabase } from "@/core/config/database";
import { Topic } from "@/models/Topic";
import { NextResponse } from "next/server";

export async function GET() {
    // moved from lib
    await connectToDatabase();
    const items = await Topic.find({ isArchived: false }).select('name slug createdAt');
    return NextResponse.json(items);
}
