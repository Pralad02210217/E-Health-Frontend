'use client';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import {
  deleteBatchByIdFn, // Import the new delete function
  fetchCategoriesFn,
  expiredMedicineFn,
} from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { formatDistanceToNow } from 'date-fns';
import { Loader } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function ExpiredMedicinesPage() {
  const queryClient = useQueryClient();
  const { data: expiredData, isLoading: expiredLoading, isError: expiredError } = useQuery({
    queryKey: ['expiredMedicines'],
    queryFn: expiredMedicineFn,
  });
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoriesFn,
  });

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [deleteBatchId, setDeleteBatchId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const deleteBatchMutation = useMutation({
    mutationFn: deleteBatchByIdFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expiredMedicines'] });
      setIsDeleteModalOpen(false);
      toast({ description: 'Batch Deleted successfully.' }); 
    },
    onError: (error: any) =>{
      setIsDeleteModalOpen(false)
      toast({ variant: "destructive", description: error?.data.message });
    }
  });

  const categoriesMap = categoriesData?.data?.categories.reduce((acc: any, category: any) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  const filteredMedicines = expiredData?.data?.medicines?.expiredBatches?.filter((medicine: any) => {
    return (
      medicine.medicine_name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === null || medicine.medicine_id === filter)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMedicines?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((filteredMedicines?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const calculateDaysExpired = (expiryDate: string) => {
    return formatDistanceToNow(new Date(expiryDate), { addSuffix: true });
  };

  const handleDelete = (batchId: string) => {
    setDeleteBatchId(batchId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteBatchId) {
      deleteBatchMutation.mutate(deleteBatchId);
    }
  };
  console.log(deleteBatchId)

  if (expiredLoading || categoriesLoading) return <div>Loading...</div>;
  if (expiredError || categoriesError) return <div>Error loading data.</div>;

  return (
    <Card className="p-4">
      <CardContent>
        <div className="flex gap-4 mb-4">
          <Input placeholder="Search Medicines..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Select onValueChange={(value) => setFilter(value === 'null' ? null : value)} value={filter === null ? 'null' : filter}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="null">All Categories</SelectItem>
              {categoriesData?.data.categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {expiredData?.data?.medicines?.expiredBatches?.length === 0 ? (
          <p className="text-center">Currently No expired items.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Medicine</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Expiry Date</TableCell>
                <TableCell>Days Expired</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems?.map((medicine: any) => (
                <TableRow key={medicine.batch_id}>
                  <TableCell>{medicine.medicine_name}</TableCell>
                  <TableCell>{medicine.batch_name}</TableCell>
                  <TableCell>{categoriesMap?.[medicine.medicine_categories] || 'Unknown'}</TableCell>
                  <TableCell>{medicine.remaining_stock}</TableCell>
                  <TableCell>{new Date(medicine.expiry_date).toISOString().slice(0, 10)}</TableCell>
                  <TableCell>{calculateDaysExpired(medicine.expiry_date)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="destructive" onClick={() => handleDelete(medicine.batch_id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex justify-center mt-4">
          <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </Button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
        <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
              <DialogDescription>Are you sure you want to delete this batch?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" disabled={deleteBatchMutation.isPending} onClick={confirmDelete}>
                {deleteBatchMutation.isPending && <Loader className='animate-spin '/>}
                {deleteBatchMutation.isPending ? "Deleting" : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}