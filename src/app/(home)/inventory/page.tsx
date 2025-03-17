import React, { Suspense } from 'react'
import InventoryPage from './_components/dashboard'

function page() {
  return (
    <Suspense>
        <InventoryPage />
    </Suspense>
  )
}

export default page