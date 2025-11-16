import React from "react";
import Link from "next/link";

async function CommunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  return (
    <div>
      CommunityPage - ID: {id}
      <div>
        <Link href={`/discussion/1`}>Go to Discussion 123</Link>
      </div>
    </div>
  );
}

export default CommunityPage;
