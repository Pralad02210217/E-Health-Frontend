'use client'
import ProfilePage from '@/components/profile/page'
import useAuth from '@/hooks/use-auth'

import React, { useEffect } from 'react'

function page() {
    const {user, refetch} = useAuth()
    useEffect(() => {
    // Refetch user data when the component mounts
    refetch();
  }, [refetch]);

  return (
    <ProfilePage user={user} refetch={refetch}/>
  )
}

export default page