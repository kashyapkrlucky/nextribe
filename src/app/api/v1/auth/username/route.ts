import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/core/config/database";
import { User } from "@/models/User";

function generateSimilarUsernames(username: string): string[] {
  const suggestions: string[] = [];
  const baseUsername = username.toLowerCase();

  // Add numbers
  for (let i = 1; i <= 9; i++) {
    suggestions.push(`${baseUsername}${i}`);
  }

  // Add common suffixes
  const suffixes = ["_", "__", "123", "2024", "dev", "app", "user"];
  suffixes.forEach((suffix) => {
    suggestions.push(`${baseUsername}${suffix}`);
  });

  // Add common prefixes
  const prefixes = ["the_", "real_", "its_", "hey_"];
  prefixes.forEach((prefix) => {
    suggestions.push(`${prefix}${baseUsername}`);
  });

  // Add random words
  const words = ["cool", "awesome", "pro", "master", "expert", "official"];
  words.forEach((word) => {
    suggestions.push(`${baseUsername}_${word}`);
  });

  return suggestions.slice(0, 8);
}

async function checkUsernameInDatabase(username: string): Promise<boolean> {
  try {
    await connectToDatabase();
    const existingUser = await User.findOne({ 
      username: username.toLowerCase().trim() 
    });
    return !!existingUser;
  } catch (error) {
    console.error("Error checking username in database:", error);
    // If database error occurs, we'll assume username is taken to be safe
    return true;
  }
}

async function filterAvailableUsernames(suggestions: string[]): Promise<string[]> {
  try {
    await connectToDatabase();
    const existingUsernames = await User.find({
      username: { $in: suggestions.map(s => s.toLowerCase().trim()) }
    }).select('username').lean();
    
    const takenUsernames = new Set(
      existingUsernames.map(user => user.username.toLowerCase().trim())
    );
    
    return suggestions.filter(suggestion => 
      !takenUsernames.has(suggestion.toLowerCase().trim())
    );
  } catch (error) {
    console.error("Error filtering available usernames:", error);
    // If database error occurs, return empty suggestions to be safe
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username parameter is required" },
        { status: 400 }
      );
    }

    // Normalize username for comparison
    const normalizedUsername = username.toLowerCase().trim();

    // Check if username is taken in the database
    const isTaken = await checkUsernameInDatabase(normalizedUsername);

    if (isTaken) {
      // Generate similar usernames and filter out taken ones
      const allSuggestions = generateSimilarUsernames(username);
      const availableSuggestions = await filterAvailableUsernames(allSuggestions);

      return NextResponse.json({
        available: false,
        message: "Username is already taken",
        suggestions: availableSuggestions,
      });
    } else {
      return NextResponse.json({
        available: true,
        message: "Username is available",
      });
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Normalize username for comparison
    const normalizedUsername = username.toLowerCase().trim();

    // Check if username is taken in the database
    const isTaken = await checkUsernameInDatabase(normalizedUsername);

    if (isTaken) {
      // Generate similar usernames and filter out taken ones
      const allSuggestions = generateSimilarUsernames(username);
      const availableSuggestions = await filterAvailableUsernames(allSuggestions);

      return NextResponse.json({
        available: false,
        message: "Username is already taken",
        suggestions: availableSuggestions,
      });
    } else {
      return NextResponse.json({
        available: true,
        message: "Username is available",
      });
    }
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
