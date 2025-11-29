import { getUserFromCookie } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { Discussion } from "@/models/Discussion";
import { NextResponse, NextRequest } from "next/server";

// Make sure models are registered
import "@/models/User";
import "@/models/Community";

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

export async function GET() {
    try {
        await connectToDatabase();
        
        // Get all discussions with author and community populated
        const discussions = await Discussion.find()
            .populate({
                path: 'author',
                select: 'name email',
                model: 'User' // Explicitly specify the model
            })
            .populate({
                path: 'community',
                select: 'name slug',
                model: 'Community' // Explicitly specify the model
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
            .exec(); // Use exec() for better TypeScript support
            
        return NextResponse.json({ data: discussions });
    } catch (error) {
        console.error('Error getting discussions:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal Server Error' }, 
            { status: 500 }
        );
    }
}
    