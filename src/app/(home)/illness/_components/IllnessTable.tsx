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
import EditIllnessModal from './EditIllnessModal'; // Import Edit modal
import DeleteIllnessModal from './DeleteIllnessModal'; // Import Delete modal

export default function IllnessPage() {
  const { data: illnessData, isLoading, isError } = useQuery({
    queryKey: ['illnesses'],
    queryFn: fetchIllnessFn,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Edit modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Delete modal state
  const [selectedIllness, setSelectedIllness] = useState<any>(null); // Selected illness

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

  return (
    <Card className="p-4">
        <div className='text-2xl bold'>
            Diseases
        </div>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button className='bg-blue-600 text-white hover:bg-blue-700' onClick={() => setIsAddModalOpen(true)}>Add Illness</Button>
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
            {illnessData?.data?.illnesses?.map((illness: any) => (
              <TableRow key={illness.id}>
                <TableCell>{illness.name}</TableCell>
                <TableCell>{illness.type}</TableCell>
                <TableCell>{illness.description}</TableCell>
                <TableCell className="flex gap-2">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md" size="sm" onClick={() => handleEditClick(illness)}>Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteClick(illness)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <AddIllnessModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} />
        <EditIllnessModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} illness={selectedIllness} />
        <DeleteIllnessModal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen} illnessId={selectedIllness?.id} />
      </CardContent>
    </Card>
  );
}