import { connectToDatabase } from "@/core/config/database";
import { Reply } from "@/models/Reply";
import { IDiscussion } from "@/core/types/index.types";

export async function GET() {
    // TODO: Implement actual top discussions logic
    await connectToDatabase();
    
    const topDiscussions: IDiscussion[] = await Reply.aggregate([
        {
            $group: {
                _id: "$discussion",
                replies: { $push: "$_id" }
            }
        },
        {
            $sort: { _id: 1 }
        },
        {
            $lookup: {
                from: "discussions",
                localField: "_id",
                foreignField: "_id",
                as: "discussionInfo"
            }
        },
        {
            $unwind: "$discussionInfo"
        },
        {
            $project: {
                _id: "$_id",
                title: "$discussionInfo.title",
                slug: "$discussionInfo.slug",
                replyCount: { $size: { $ifNull: ["$replies", []] } }
            }
        }
    ]);
    
    return new Response(JSON.stringify({ data: topDiscussions }), {
        headers: { "Content-Type": "application/json" }
    });
}