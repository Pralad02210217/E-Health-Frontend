'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createIllnessCategoryFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import { useForm } from 'react-hook-form';
import { useEffect } from 'react'; // Import useEffect

interface AddIllnessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddIllnessModal({ open, onOpenChange }: AddIllnessModalProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const queryClient = useQueryClient();

  const createIllnessMutation = useMutation({
    mutationFn: (data: { name: string}) =>
      createIllnessCategoryFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnessesCategory'] });
      onOpenChange(false);
      reset();
      toast({ description: 'Illness Category added successfully.' });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', description: `Failed to add illness Category: ${error?.data?.message || error.message || 'Unknown error'}` });
    },
  });

  const onSubmit = (data: { name: string }) => {
    createIllnessMutation.mutate(data);
  };

  useEffect(() => {
    if (!open) {
      reset(); 
    }
  }, [open, reset]); 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Illness</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right sm:block hidden">
              Name
            </Label>
            <Input id="name" placeholder="Illness Name" {...register('name')} className="col-span-3" />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>
          <DialogFooter>
            <Button className='w-full bg-blue-600 text-white hover:bg-blue-700' type="submit" disabled={isSubmitting || createIllnessMutation.isPending}>
              {isSubmitting || createIllnessMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting || createIllnessMutation.isPending ? 'Adding...' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}