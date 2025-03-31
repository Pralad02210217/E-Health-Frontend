import React, { Suspense } from 'react'
import DashbordCharts from './_components/DashbordCharts'

function page() {
  return (
    <Suspense>
        <DashbordCharts />
    </Suspense>
  )
}

export default page