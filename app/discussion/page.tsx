import Link from "next/link";
import React from "react";

function DiscussionList() {

  const list = [
    { id: 1, name: "Discussion A" },
    { id: 2, name: "Discussion B" },
    { id: 3, name: "Discussion C" },
  ];
  return <div>
    {list.map((discussion) => (
      <Link key={discussion.id} href={`/discussion/${discussion.id}`}>{discussion.name}</Link>
    ))}
  </div>;
}

export default DiscussionList;
