'use client'
import { Button } from '@/components/ui/button'
import useAuth from '@/hooks/use-auth'
import { toast } from '@/hooks/use-toast'
import { toggleAvailabilityFn } from '@/lib/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import React, { useCallback } from 'react'

const SetAvailable = ({ onSuccesses, disabled }: { onSuccesses: () => void , disabled:boolean}) => {

    const queryClient = useQueryClient()
    const {refetch} = useAuth();

    const { mutate, isPending } = useMutation({
        mutationFn: toggleAvailabilityFn,
        onSuccess: (response: any) => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            refetch()
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
     className="text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90"
     onClick={handleClick}
     >
        {isPending && <Loader className='animate-spin'/>}
        Set Availalbe
    </Button>
  )
}

export default SetAvailable