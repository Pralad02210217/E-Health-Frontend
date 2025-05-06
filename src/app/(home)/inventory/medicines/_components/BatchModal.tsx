'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { updateBatchFn, deleteBatchByIdFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Loader } from 'lucide-react';

interface Batch {
  id: string;
  batch_name: string;
  quantity: number;
  expiry_date: string;
}

interface BatchModalContentProps {
  batches: Batch[];
  onClose: () => void;
}

export default function BatchModalContent({ batches, onClose }: BatchModalContentProps) {
  const queryClient = useQueryClient();
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [editedBatchName, setEditedBatchName] = useState<string | undefined>(undefined);
  const [editedQuantity, setEditedQuantity] = useState<number | undefined>(undefined);
  const [editedExpiryDate, setEditedExpiryDate] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false); // Add saving state

  const updateBatchMutation = useMutation({
    mutationFn: (variables: { id: string; data: { batch_name: string; quantity: number; expiry_date: string } }) =>
      updateBatchFn(variables.id, variables.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      setEditingBatch(null);
      toast({ description: 'Batch updated successfully.' });
      setIsSaving(false); // Reset saving state
      onClose(); // Close the modal
    },
    onError: (error: any) => {
      setIsSaving(false); // Reset saving state
      toast({ variant: 'destructive', description: `Failed to update batch: ${error?.data?.message || error.message || 'Unknown error'}` });
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: deleteBatchByIdFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      onClose(); 
      toast({ description: 'Batch deleted successfully.' });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', description: `Failed to delete batch: ${error?.data?.message || error.message || 'Unknown error'}` });
    },
  });

  const editBatch = (batch: any) => {
    setEditingBatch(batch);
    setEditedBatchName(batch.batch_name);
    setEditedQuantity(batch.quantity);
    setEditedExpiryDate(new Date(batch.expiry_date).toISOString().slice(0, 10));
  };

  const saveBatch = () => {
    if (editingBatch && editedQuantity !== undefined && editedExpiryDate && editedBatchName) {
      setIsSaving(true); // Set saving state
      updateBatchMutation.mutate({ id: editingBatch.id, data: { batch_name: editedBatchName, quantity: editedQuantity, expiry_date: editedExpiryDate } });
    }
  };

  const deleteBatch = (batchId: string) => {
    deleteBatchMutation.mutate(batchId);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Batch Name</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Expiry Date</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {batches?.map((batch: any) => (
          <TableRow key={batch.id}>
            <TableCell>
              {editingBatch?.id === batch.id ? (
                <Input value={editedBatchName} onChange={(e) => setEditedBatchName(e.target.value)} />
              ) : (
                batch.batch_name
              )}
            </TableCell>
            <TableCell>
              {editingBatch?.id === batch.id ? (
                <Input className="w-32" type="number" value={editedQuantity} onChange={(e) => setEditedQuantity(Number(e.target.value))} />
              ) : (
                batch.quantity
              )}
            </TableCell>
            <TableCell>
              {editingBatch?.id === batch.id ? (
                <Input type="date" value={editedExpiryDate} onChange={(e) => setEditedExpiryDate(e.target.value)} />
              ) : (
                new Date(batch.expiry_date).toISOString().slice(0, 10)
              )}
            </TableCell>
            <TableCell className="flex gap-2">
              {editingBatch?.id === batch.id ? (
                <Button size="sm" className='"bg-blue-600 text-white hover:bg-blue-700' onClick={saveBatch}>
                  {isSaving ? 'Saving...' : 'Save'}
                </Button>
              ) : (
                <Button size="sm" className='bg-blue-600 text-white hover:bg-blue-700' onClick={() => editBatch(batch)}>Edit</Button>
              )}
              <Button variant="destructive" size="sm" onClick={() => deleteBatch(batch.id)} disabled={deleteBatchMutation.isPending}>
                {deleteBatchMutation.isPending && <Loader className='animate-spin'/>}
                {deleteBatchMutation.isPending ? "Deleting" : "Delete"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}