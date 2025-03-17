'use client';
import { useState, useEffect } from 'react';
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
import { updateIllnessFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import { useForm } from 'react-hook-form'; // Import useForm

interface EditIllnessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  illness: any;
}

export default function EditIllnessModal({ open, onOpenChange, illness }: EditIllnessModalProps) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: illness?.name || '',
      type: illness?.type || 'COMMUNICABLE',
      description: illness?.description || '',
    },
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (illness) {
      reset({
        name: illness.name,
        type: illness.type,
        description: illness.description,
      });
    }
  }, [illness, reset]);

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [open, reset]);

  const updateIllnessMutation = useMutation({
    mutationFn: (variables: { id: string; data: { name: string; type: string; description: string } }) =>
      updateIllnessFn(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnesses'] });
      onOpenChange(false);
      toast({ description: 'Illness updated successfully.' });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', description: `Failed to update illness: ${error?.data?.message || error.message || 'Unknown error'}` });
    },
  });

  const onSubmit = (data: { name: string; type: string; description: string }) => {
    updateIllnessMutation.mutate({ id: illness.id, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Illness</DialogTitle>
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
            <Select {...register('type')} defaultValue={illness?.type || "COMMUNICABLE"}>
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
            <Button className='w-full bg-blue-600 text-white hover:bg-blue-700' type="submit" disabled={isSubmitting || updateIllnessMutation.isPending}>
              {isSubmitting || updateIllnessMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isSubmitting || updateIllnessMutation.isPending ? 'Updating...' : 'Update'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}