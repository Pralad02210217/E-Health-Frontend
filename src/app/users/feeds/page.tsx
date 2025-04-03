import FeedPage from '@/app/(home)/feeds/page'
import React, { Suspense } from 'react'

function page() {
  return (
    <Suspense>
        <FeedPage/>
    </Suspense>
  )
}

export default page