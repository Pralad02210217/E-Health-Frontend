'use client';
import { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import useAuth from '@/hooks/use-auth';
import { fetchTreatmentFn } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PatientDetailsDialog from './DetailedHistory';


interface Treatment {
  treatmentId: string;
  patientName: string;
  severity: string;
  createdAt: string;
  notes: string;
  bloodPressure: string | null;
  forwardedByHospital: boolean;
  forwardedToHospital: boolean;
  medicines: {
    medicineName: string;
    medicineCount: number;
  }[];
  illnesses?: {
    illnessId: string;
    illnessName: string;
    illnessType: string;
    illnessDescription: string;
  }[] | null;
}

export default function PatientTreatments() {
  const { user } = useAuth();
  const patientId = user?.userId;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null); // Update type
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState<string | null>(null);

  const { data: treatmentData, isLoading, isError } = useQuery({
    queryKey: ['treatments', patientId],
    queryFn: () => fetchTreatmentFn(patientId),
  });
  console.log(treatmentData);
  const treatments = treatmentData?.data.treatments || [];
  console.log(treatments)

  interface FamilyMember {
    id: string | null;
    name: string | undefined;
  }

  const familyMembers = useMemo(() => {
    const uniqueFamilyMemberIds = new Set(treatments.filter((t: any) => t.familyMemberId).map((t: any) => t.familyMemberId));
    const members = Array.from(uniqueFamilyMemberIds).map(id => {
      const treatment = treatments.find((t: any) => t.familyMemberId === id);
      return { id: id as string, name: treatment?.patientName };
    }) as FamilyMember[];

    // Add 'Self' option
    members.unshift({ id: patientId, name: 'Self' });

    return members;
  }, [treatments, patientId]);

  const filteredTreatments = useMemo(() => {
    return treatments.filter((treatment: any) => {
      const illnessMatch = Array.isArray(treatment.illnesses) && treatment.illnesses.length > 0
        ? treatment.illnesses.some((illness: any) =>
          illness.illnessName && illness.illnessName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : searchTerm === '';

      const dateMatch = selectedDate
        ? format(new Date(treatment.createdAt), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
        : true;

      let familyMemberMatch = selectedFamilyMemberId
        ? (selectedFamilyMemberId === patientId ? treatment.patientId === patientId : treatment.familyMemberId === selectedFamilyMemberId)
        : true;

      if (selectedFamilyMemberId === "") {
        familyMemberMatch = true;
      }

      return illnessMatch && dateMatch && familyMemberMatch;
    });
  }, [treatments, searchTerm, selectedDate, selectedFamilyMemberId, patientId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTreatments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredTreatments.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleViewDetails = (treatment: Treatment) => { // Update type
    setSelectedTreatment(treatment);
  };

  const clearDateFilter = () => {
    setSelectedDate(undefined);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading treatments.</div>;

  return (
    <Card className="p-4">
      <div className="text-2xl bold">Patient Treatments</div>
      <CardContent>
        <div className="flex justify-between mb-4">
          <Input
            type="text"
            placeholder="Search Illness"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={'outline'}>Pick Date</Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
              </PopoverContent>
            </Popover>
            {selectedDate && <Button variant="outline" size="sm" onClick={clearDateFilter}>Clear Date</Button>}
          </div>
          {familyMembers.length > 0 && (
            <Select onValueChange={(value: string | null) => setSelectedFamilyMemberId(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Family Member" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null as any}>All</SelectItem>
                {familyMembers.map(member => (
                  <SelectItem key={member.id} value={member.id!}>{member.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Illness</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell>Medicines</TableCell>
              <TableCell>Medicines Count</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((treatment: Treatment) => (
              <TableRow key={treatment.treatmentId}>
                <TableCell>
                  {Array.isArray(treatment.illnesses) ? treatment.illnesses.map((illness: any) => illness.illnessName).join(', ') : 'N/A'}
                </TableCell>
                <TableCell>{treatment.notes}</TableCell>
                <TableCell>
                  {Array.isArray(treatment.medicines) ? treatment.medicines.map((medicine: any) => medicine.medicineName).join(', ') : 'N/A'}
                </TableCell>
                <TableCell>{treatment.medicines.length}</TableCell>
                <TableCell>{format(new Date(treatment.createdAt), 'yyyy-MM-dd')}</TableCell>
                <TableCell>
                  <Button className='bg-blue-600 text-white hover:bg-blue-700' onClick={() => handleViewDetails(treatment)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
        <PatientDetailsDialog
          selectedTreatment={selectedTreatment}
          onClose={() => setSelectedTreatment(null)}
        />
      </CardContent>
    </Card>
  );
}