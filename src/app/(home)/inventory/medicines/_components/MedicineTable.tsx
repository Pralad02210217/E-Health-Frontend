'use client';
import { useState, useEffect } from 'react';
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
import { deleteMedicineFn, fetchCategoriesFn, fetchMedicinesFn } from '@/lib/api';
import AddMedicineModal from './AddMedicine';
import { DeleteMedicineModal, EditMedicineModal } from './EditMedicine';
import { useSearchParams } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import BatchModalContent from './BatchModal';

export default function MedicinesPage() {
  const queryClient = useQueryClient();
  const { data: medicinesData, isLoading: medicinesLoading, isError: medicinesError } = useQuery({
    queryKey: ['medicines'],
    queryFn: fetchMedicinesFn,
  });
  const { data: categoriesData, isLoading: categoriesLoading, isError: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategoriesFn,
  });
  const searchParams = useSearchParams();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedMedicineBatches, setSelectedMedicineBatches] = useState<Array<any>>([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  useEffect(() => {
    const categoryId = searchParams.get('categoryId');
    if (categoryId) {
      setFilter(categoryId);
    } else {
      setFilter(null);
    }
  }, [searchParams]);

  const deleteMutation = useMutation({
    mutationFn: deleteMedicineFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
    },
  });

  const categoriesMap = categoriesData?.data?.categories.reduce((acc: any, category: any) => {
    acc[category.id] = category.name;
    return acc;
  }, {});

  const filteredMedicines = medicinesData?.data?.medicines.filter((medicine: any) => {
    return (
      medicine.name.toLowerCase().includes(search.toLowerCase()) &&
      (filter === null || medicine.category_id === filter)
    );
  });

  const medicinesWithTotalAmount = filteredMedicines?.map((medicine: any) => ({
    ...medicine,
    totalAmount: medicine.batches ? medicine.batches.reduce((sum: number, batch: any) => sum + batch.quantity, 0) : 0,
  }));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = medicinesWithTotalAmount?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil((medicinesWithTotalAmount?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const showBatchModal = (medicine: any) => {
    setSelectedMedicineBatches(medicine.batches || []);
    setIsBatchModalOpen(true);
  };

  if (medicinesLoading || categoriesLoading) return <div>Loading...</div>;
  if (medicinesError || categoriesError) return <div>Error loading data.</div>;

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
          <AddMedicineModal categoriesData={categoriesData} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems?.map((medicine: any) => (
              <TableRow key={medicine.id}>
                <TableCell>{medicine.name}</TableCell>
                <TableCell>{categoriesMap?.[medicine.category_id] || 'Unknown'}</TableCell>
                <TableCell>{medicine.unit}</TableCell>
                <TableCell>{medicine.totalAmount}</TableCell>
                <TableCell className="flex gap-2">
                  <EditMedicineModal medicine={medicine} categoriesData={categoriesData} />
                  <DeleteMedicineModal medicine={medicine} />
                  <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => showBatchModal(medicine)}>View Batches</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
        <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Batches</DialogTitle>
            </DialogHeader>
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
                {selectedMedicineBatches?.map((batch: any) => (
                  <TableRow key={batch.id}>
                    <TableCell>{batch.batch_name}</TableCell>
                    <TableCell>{batch.quantity}</TableCell>
                    <TableCell>{new Date(batch.expiry_date).toISOString().slice(0, 10)}</TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm">Edit</Button>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </DialogContent>
        </Dialog>
        <Dialog open={isBatchModalOpen} onOpenChange={setIsBatchModalOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Batches</DialogTitle>
            </DialogHeader>
            <BatchModalContent batches={selectedMedicineBatches} onClose={() => setIsBatchModalOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}