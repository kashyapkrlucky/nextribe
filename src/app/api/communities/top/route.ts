import { connectToDatabase } from "@/lib/mongodb";
import { Member } from "@/models/Member";

export async function GET() {
    try {
        await connectToDatabase();
        
        // Find top communities by member count
        const topCommunities = await Member.aggregate([
            {
                $group: {
                    _id: "$community",
                    memberCount: { $sum: 1 }
                }
            },
            {
                $sort: { memberCount: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "communities",
                    localField: "_id",
                    foreignField: "_id",
                    as: "communityInfo"
                }
            },
            {
                $unwind: "$communityInfo"
            },
            {
                $project: {
                    _id: "$_id",
                    name: "$communityInfo.name",
                    slug: "$communityInfo.slug",
                    memberCount: 1
                }
            }
        ]);
        
        return new Response(JSON.stringify({ data: topCommunities }), {
          headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error fetching top communities:", error);
        return new Response(JSON.stringify({ data: [] }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
    }
}