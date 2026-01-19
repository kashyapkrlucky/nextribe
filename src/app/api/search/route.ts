import { connectToDatabase } from '@/core/config/database';
import {Community} from '@/models/Community';
import {User} from '@/models/User';
import {Discussion} from '@/models/Discussion';
import { ErrorResponse, SuccessResponse } from '@/core/utils/responses';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query.trim()) {
      return ErrorResponse("Search query is required")
    }

    // Create a case-insensitive regex for the search
    const searchRegex = new RegExp(query, 'i');

    // Search across communities, users, and discussions in parallel
    const [communities, users, discussions] = await Promise.all([
      // Search communities
      Community.find({
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } }
        ]
      })
      .select('name slug description memberCount')
      .limit(5)
      .lean(),

      // Search users
      User.find({
        $or: [
          { name: { $regex: searchRegex } },
          { email: { $regex: searchRegex } }
        ]
      })
      .select('username email avatar')
      .limit(5)
      .lean(),

      // Search discussions
      Discussion.find({
        $or: [
          { title: { $regex: searchRegex } },
          { body: { $regex: searchRegex } }
        ]
      })
      .select('title slug body community')
      .populate('community', 'name slug')
      .limit(5)
      .lean()
    ]);

    return SuccessResponse({
      users,
      communities,
      discussions
    });

  } catch (error) {
    console.error('Search error:', error);
    return ErrorResponse(error);
  }
}