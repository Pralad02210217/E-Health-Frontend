
'use client'
import { Header } from '@/components/Layouts/header'
import useAuth from '@/hooks/use-auth'
import { fetchContactFn } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import React, { Suspense, useEffect } from 'react'

function page() {

  return (
    <Suspense>
        <Header/>
    </Suspense>
  )
}

export default page