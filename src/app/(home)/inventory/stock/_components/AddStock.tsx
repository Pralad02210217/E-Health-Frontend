'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMedicinesFn, addTransactionFn } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';

const addStockSchema = z.object({
  medicineId: z.string().min(1, 'Medicine is required'),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, 'Quantity must be at least 1')),
  reason: z.string().min(1, 'Reason is required'),
  batch_name: z.string().min(1, 'Batch name is required'),
  expiry_date: z.string().min(1, 'Expiry date is required'),
});

export default function AddStockModal() {
  const queryClient = useQueryClient();
  const { data: medicinesData, isLoading: medicinesLoading, isError: medicinesError } = useQuery({
    queryKey: ['medicines'],
    queryFn: fetchMedicinesFn,
  });

  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(addStockSchema),
  });

  const { mutate: addMutation, isPending } = useMutation({
    mutationFn: addTransactionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({ description: 'Stock added successfully.' });
      setOpen(false);
      reset();
    },
    onError: (error) => {
      toast({ variant: 'destructive', description: `Failed to add stock: ${error.message}` });
    },
  });

  const onSubmit = (data: any) => {
    addMutation({
      medicine_id: data.medicineId,
      quantity: data.quantity,
      reason: data.reason,
      batch_name: data.batch_name,
      expiry_date: data.expiry_date,
    });
  };

  if (medicinesLoading) return <div>Loading medicines...</div>;
  if (medicinesError) return <div>Error loading medicines.</div>;

  const medicineOptions = medicinesData?.data.medicines.map((medicine: any) => ({
    value: medicine.id,
    label: medicine.name,
  })) || [];

  const handleMedicineChange = (selectedOption: any) => {
    setValue('medicineId', selectedOption?.value || '');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">Add Stock</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Add Stock</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="medicineId">Medicine</Label>
            <Select
              options={medicineOptions}
              onChange={handleMedicineChange}
              placeholder="Select Medicine"
            />
            {errors.medicineId && <p className="text-red-500 text-sm mt-1">{errors.medicineId.message}</p>}
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input type="number" id="quantity" {...register('quantity')} placeholder="Quantity" />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>}
          </div>
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input type="text" id="reason" {...register('reason')} placeholder="Reason" />
            {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>}
          </div>
          <div>
            <Label htmlFor="batch_name">Batch Name</Label>
            <Input type="text" id="batch_name" {...register('batch_name')} placeholder="Batch Name" />
            {errors.batch_name && <p className="text-red-500 text-sm mt-1">{errors.batch_name.message}</p>}
          </div>
          <div>
            <Label htmlFor="expiry_date">Expiry Date</Label>
            <Input type="date" id="expiry_date" {...register('expiry_date')} placeholder="Expiry Date" />
            {errors.expiry_date && <p className="text-red-500 text-sm mt-1">{errors.expiry_date.message}</p>}
          </div>
          <Button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white hover:bg-blue-700">
            {isPending ? 'Adding...' : 'Add Stock'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}