import React, { Suspense } from 'react'
import { SignUpHADialog } from './_components/RegisterDialog'
import DeanPage from './_components/DeanPage'

function page() {
  return (
    <div>
        <Suspense>
          <DeanPage />
        </Suspense>
    </div>
  )
}

export default page