import React from 'react'

function DiscussionLayout({ children }: { children: React.ReactNode }) {
  return (
    
      <>
        <header>
          <h1>Discussions</h1>
        </header>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </>
  )
}

export default DiscussionLayout