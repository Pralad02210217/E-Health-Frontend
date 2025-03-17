import React, { Suspense } from 'react'
import ExpiredMedicinesPage from './_components/Expired-Items'

function page() {
  return (
    <Suspense>
        <ExpiredMedicinesPage />
    </Suspense>
  )
}

export default page