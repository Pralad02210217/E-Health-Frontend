'use client'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { toggleAvailabilityFn } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import React, { useCallback } from 'react'

const SetBriefLeave = ({ onSuccesses, disabled }: { onSuccesses: () => void, disabled: boolean }) => {

    const queryClient = useQueryClient()
    const {refetch} = useAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: toggleAvailabilityFn,
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            onSuccesses()
        },
        onError: (error: any) => {
            toast({
                title: 'Error',
                description: error.data.message,
                variant: 'destructive'
            })
        },
    })

    const handleClick = useCallback(()=>{
        mutate()
    },[])
  return (
    <Button 
     disabled={isPending || disabled}
     className="h-[35px] !text-[#c40006d3] !bg-red-100 shadow-none mr-1"
     onClick={handleClick}
     >
        {isPending && <Loader className='animate-spin'/>}
        Set Brief Leave
    </Button>
  )
}

export default SetBriefLeave