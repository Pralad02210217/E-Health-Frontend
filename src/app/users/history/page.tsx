import React, { Suspense } from 'react'
import PatientTreatments from './_components/HistoryTable'

function page() {
  return (
    <Suspense>
        <PatientTreatments />
    </Suspense>
  )
}

export default page