import { getUserFromCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Discussion } from "@/models/Discussion";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const user = await getUserFromCookie();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const discussion = {
            title: body.title,
            body: body.body,
            slug: body.slug || undefined,
            community: body.community,
            author: user?._id?.toString(),
        };
        const item = await Discussion.create(discussion);
        
        return NextResponse.json({ message: "Discussion created successfully", data: item.toObject()._id }, { status: 201 });
    } catch (error) {
        console.error('Error creating discussion:', error);
        return NextResponse.json({ error: "Bad Request" }, { status: 400 });
    }
}
