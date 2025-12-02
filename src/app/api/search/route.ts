import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/core/config/database';
import {Community} from '@/models/Community';
import {User} from '@/models/User';
import {Discussion} from '@/models/Discussion';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query.trim()) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
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
      .select('name email')
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

    return NextResponse.json({
      success: true,
      data: {
        users,
        communities,
        discussions
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}