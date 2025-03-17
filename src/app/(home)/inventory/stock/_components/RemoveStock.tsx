'use client';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMedicinesFn, removeTransactionFn } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Select from 'react-select';

const removeStockSchema = z.object({
  medicineId: z.string().min(1, 'Medicine is required'),
  quantity: z.preprocess((val) => Number(val), z.number().min(1, 'Quantity must be at least 1')),
  reason: z.string().min(1, 'Reason is required'),
  batchId: z.string().min(1, 'Batch is required'),
});

export default function RemoveStockModal() {
  const queryClient = useQueryClient();
  const { data: medicinesData, isLoading: medicinesLoading, isError: medicinesError } = useQuery({
    queryKey: ['medicines'],
    queryFn: fetchMedicinesFn,
  });

  const [open, setOpen] = useState(false);
  interface SelectOption {
    value: string;
    label: string;
  }
  
  const [selectedMedicine, setSelectedMedicine] = useState<SelectOption | null>(null);
  const [batchOptions, setBatchOptions] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(removeStockSchema),
  });

  const { mutate: removeMutation, isPending } = useMutation({
    mutationFn: removeTransactionFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast({ description: 'Stock removed successfully.' });
      setOpen(false);
      reset();
      setSelectedMedicine(null);
      setBatchOptions([]);
    },
    onError: (error) => {
      toast({ variant: 'destructive', description: `Failed to remove stock: ${error.message}` });
    },
  });

  const onSubmit = (data: any) => {
    removeMutation({
      batch_id: data.batchId,
      quantity: data.quantity,
      reason: data.reason,
    });
  };

  useEffect(() => {
    if (selectedMedicine) {
      const selectedMedicineData = medicinesData?.data?.medicines.find(
        (medicine:any) => medicine.id === selectedMedicine.value
      );
      if (selectedMedicineData && selectedMedicineData.batches) {
        setBatchOptions(
          selectedMedicineData.batches.map((batch:any) => ({
            value: batch.id,
            label: batch.batch_name,
          }))
        );
      } else {
        setBatchOptions([]);
      }
    } else {
      setBatchOptions([]);
    }
    setValue('batchId', '');
  }, [selectedMedicine, medicinesData, setValue]);

  if (medicinesLoading) return <div>Loading medicines...</div>;
  if (medicinesError) return <div>Error loading medicines.</div>;

  const medicineOptions = medicinesData?.data?.medicines.map((medicine: any) => ({
    value: medicine.id,
    label: medicine.name,
  })) || [];

  const handleMedicineChange = (selectedOption: any) => {
    setSelectedMedicine(selectedOption);
    setValue('medicineId', selectedOption?.value || '');
  };

  const handleBatchChange = (selectedOption: any) => {
    setValue('batchId', selectedOption?.value || '');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Remove Stock</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Remove Stock</DialogTitle>
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
          {selectedMedicine && (
            <div>
              <Label htmlFor="batchId">Batch</Label>
              <Select
                options={batchOptions}
                onChange={handleBatchChange}
                placeholder="Select Batch"
              />
              {errors.batchId && <p className="text-red-500 text-sm mt-1">{errors.batchId.message}</p>}
            </div>
          )}
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
          <Button variant="destructive" type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Removing...' : 'Remove Stock'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}