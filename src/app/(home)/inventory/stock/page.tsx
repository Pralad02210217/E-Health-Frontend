import React, { Suspense } from 'react'
import StockPage from './_components/TransactionTable'

function page() {
  return (
    <Suspense>
        <StockPage />
    </Suspense>
  )
}

export default page