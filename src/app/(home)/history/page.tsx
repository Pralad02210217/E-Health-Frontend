import React, { Suspense } from 'react'
import PatientHistory from './_components/PatientHistory'

function page() {
  return (
    <Suspense>
        <PatientHistory />
    </Suspense>
  )
}

export default page