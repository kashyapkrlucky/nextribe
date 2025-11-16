import React from 'react'

async function DiscussionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  console.log('Discussion ID:', id);
  return (
    <div>DiscussionPage</div>
  )
}

export default DiscussionPage