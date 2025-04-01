import React, { Suspense } from 'react'

import DashboardFinal from './_components/Dashboard'

function page() {
  return (
    <Suspense>
        <DashboardFinal />  
    </Suspense>
  )
}

export default page