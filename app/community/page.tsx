import Link from "next/link";
import React from "react";

function CommunityList() {
  const list = [
    { id: 1, name: "Community A" },
    { id: 2, name: "Community B" },
    { id: 3, name: "Community C" },
  ];
  return (
    <div>
      {list.map((community) => (
        <div key={community.id}>
          <Link href={`/community/${community.id}`}> {community.name}</Link>
        </div>
      ))}
    </div>
  );
}

export default CommunityList;
