import React, { Suspense } from 'react'
import MedicinesPage from './_components/MedicineTable'

function page() {
  return (
    <Suspense>
        <MedicinesPage />
    </Suspense>
  )
}

export default page