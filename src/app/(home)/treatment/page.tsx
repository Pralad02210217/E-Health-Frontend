import React, { Suspense } from 'react'
import TreatmentForm from './_components/TreatmentForm'

function page() {
  return (
    <Suspense>
        <TreatmentForm />
    </Suspense>
  )
}

export default page