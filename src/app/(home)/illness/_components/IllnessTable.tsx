'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { fetchIllnessFn } from '@/lib/api';
import AddIllnessModal from './AddIllnessModal';
import EditIllnessModal from './EditIllnessModal';
import DeleteIllnessModal from './DeleteIllnessModal';

export default function IllnessPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this

  const { data: illnessData, isLoading, isError } = useQuery({
    queryKey: ['illnesses'],
    queryFn: fetchIllnessFn,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIllness, setSelectedIllness] = useState<any>(null);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading illnesses.</div>;

  const handleEditClick = (illness: any) => {
    setSelectedIllness(illness);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (illness: any) => {
    setSelectedIllness(illness);
    setIsDeleteModalOpen(true);
  };

  const illnesses = illnessData?.data?.illnesses || [];
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIllnesses = illnesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(illnesses.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Card className="p-4">
      <div className="text-2xl bold">Diseases</div>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Illness
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentIllnesses.map((illness: any) => (
              <TableRow key={illness.id}>
                <TableCell>{illness.name}</TableCell>
                <TableCell>{illness.type}</TableCell>
                <TableCell>{illness.description}</TableCell>
                <TableCell className="flex gap-2">
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md"
                    size="sm"
                    onClick={() => handleEditClick(illness)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(illness)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <Button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                variant={currentPage === pageNumber ? 'default' : 'outline'}
              >
                {pageNumber}
              </Button>
            ))}
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        <AddIllnessModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        <EditIllnessModal
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          illness={selectedIllness}
        />
        <DeleteIllnessModal
          open={isDeleteModalOpen}
          onOpenChange={setIsDeleteModalOpen}
          illnessId={selectedIllness?.id}
        />
      </CardContent>
    </Card>
  );
}