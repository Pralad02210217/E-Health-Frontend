import React, { Suspense } from 'react'
import ResetPassword from './_resetpassword'

const page = () => {
  return (
    <Suspense>
        <ResetPassword />
    </Suspense>
  )
}

export default page