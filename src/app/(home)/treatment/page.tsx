import React, { Suspense } from 'react'
import TreatmentForm1 from './_components/TreatFormFinal'

function page() {
  return (
    <Suspense>
        <TreatmentForm1 />
    </Suspense>
  )
}

export default page