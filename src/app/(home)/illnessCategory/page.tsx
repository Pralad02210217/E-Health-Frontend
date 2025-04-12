import React, { Suspense } from 'react'
import IllnessPage from './_components/IllnessTable'

function page() {
  return (
    <Suspense>
        <IllnessPage/>
    </Suspense>
  )
}

export default page