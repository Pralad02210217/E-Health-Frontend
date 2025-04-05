import React, { Suspense } from 'react'
import StudentHealthVisitsPage from './_component/StudentVistit'

function page() {
  return (
    <Suspense>
        <StudentHealthVisitsPage />
    </Suspense>
  )
}

export default page