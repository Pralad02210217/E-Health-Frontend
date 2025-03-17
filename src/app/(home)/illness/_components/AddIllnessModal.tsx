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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createIllnessFn } from '@/lib/api';
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
      type: 'COMMUNICABLE',
      description: '',
    },
  });

  const queryClient = useQueryClient();

  const createIllnessMutation = useMutation({
    mutationFn: (data: { name: string; type: string; description: string }) =>
      createIllnessFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnesses'] });
      onOpenChange(false);
      reset();
      toast({ description: 'Illness added successfully.' });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', description: `Failed to add illness: ${error?.data?.message || error.message || 'Unknown error'}` });
    },
  });

  const onSubmit = (data: { name: string; type: string; description: string }) => {
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
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right sm:block hidden">
              Type
            </Label>
            <Select {...register('type')} defaultValue="COMMUNICABLE">
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMMUNICABLE">COMMUNICABLE</SelectItem>
                <SelectItem value="NON_COMMUNICABLE">NON_COMMUNICABLE</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right sm:block hidden">
              Description
            </Label>
            <Input id="description" placeholder="Illness Description" {...register('description')} className="col-span-3" />
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