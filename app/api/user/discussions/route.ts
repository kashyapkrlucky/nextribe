import { getUserIdFromRequest } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    console.log(userId);
    
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    return NextResponse.json([]);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
