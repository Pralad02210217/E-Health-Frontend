import React, { Suspense } from 'react'
import ComfirmAccount from './_confirmaccount'

const page = () => {
  return (
    <Suspense>
        <ComfirmAccount />
    </Suspense>
  )
}

export default page