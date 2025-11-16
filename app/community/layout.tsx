import React from 'react'

function CommunityLayout({ children }: { children: React.ReactNode }) {
  return (
      <>
        <header>
          <h1>Communities</h1>
        </header>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <main>{children}</main>
      </>
  )
}

export default CommunityLayout