'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllTreatmentFn } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertCircle, FileText, Loader2, Search } from 'lucide-react';
import TreatmentDetailsDialog from './PatientDetailHistory';
import { Badge } from '@/components/ui/badge';


interface Treatment {
  treatmentId: string;
  patientId: string | null;
  familyMemberId: string | null;
  doctorId: string;
  severity: string;
  notes: string;
  createdAt: string;
  patientName: string;
  patientGender: string;
  patientBloodType: string;
  bloodPressure: string | null;
  forwardedByHospital: boolean;
  forwardedToHospital: boolean;
  patientContactNumber: string;
  patientDateOfBirth: string;
  patientType: string;
  medicines: { 
    medicineId: string;
    medicineName: string; 
    medicineCount: number;
  }[];
  illnesses: { 
    illnessId: string;
    illnessName: string; 
    illnessType: string; 
    illnessDescription: string;
  }[] | null;
  medicinesUsedCount: string;
}

export default function PatientHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ['treatments'],
    queryFn: fetchAllTreatmentFn,
  });

  console.log(data)

  const treatments: Treatment[] = data?.data?.treatments || [];

  const [selectedPatientTreatments, setSelectedPatientTreatments] = useState<Treatment[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<Treatment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const handleViewDetails = (patientName: string) => {
    const patientTreatments = treatments.filter((t: Treatment) => t.patientName === patientName);
    setSelectedPatientTreatments(patientTreatments);
  };

  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth);
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && currentDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredTreatments = useMemo(() => {
    return treatments.filter((treatment) =>
      treatment.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [treatments, searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTreatments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const uniquePatients = useMemo(() => {
    const seen = new Set();
    return currentItems.filter((treatment) => {
      const duplicate = seen.has(treatment.patientName);
      seen.add(treatment.patientName);
      return !duplicate;
    });
  }, [currentItems]);

  const truncateNotes = (notes: string, maxLength: number) => {
    if (notes.length > maxLength) {
      return notes.substring(0, maxLength) + '...';
    }
    return notes;
  };

  const handleCloseDetailsDialog = () => {
    setSelectedTreatment(null);
  };
    const getSeverityColor = (severity: any) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading data...</span>
        </CardContent>
      </Card>
    );
  }

    return (
    <Card className="w-full max-w-5xl mx-auto shadow-lg border-t-4 bg-white">
        <CardHeader className="bg-gray-50 py-4 px-6 border-b border-gray-200">
        <CardTitle className="text-2xl font-bold text-gray-800">Patient Treatment History</CardTitle>
        <CardDescription className="text-gray-500 mt-1">
            View and manage patient treatment records
        </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
        <div className="mb-6">
            <div className="relative">
            <input
                type="text"
                placeholder="Search by patient name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 pl-10 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
        </div>
        
        <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <Table>
            <TableHeader className="bg-gray-100 border-b">
                <TableRow>
                <TableHead className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</TableHead>
                <TableHead className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Age</TableHead>
                <TableHead className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</TableHead>
                <TableHead className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Blood Type</TableHead>
                <TableHead className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gender</TableHead>
                <TableHead className="p-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {uniquePatients.map((treatment: Treatment) => (
                <TableRow 
                    key={treatment.treatmentId} 
                    className="hover:bg-gray-50 transition-colors duration-150 border-b last:border-b-0"
                >
                    <TableCell className="p-4 text-sm text-gray-900">{treatment.patientName}</TableCell>
                    <TableCell className="p-4 text-sm text-gray-600">{calculateAge(treatment.patientDateOfBirth)}</TableCell>
                    <TableCell className="p-4 text-sm text-gray-600">{treatment.patientContactNumber}</TableCell>
                    <TableCell className="p-4 text-sm text-gray-600">{treatment.patientBloodType}</TableCell>
                    <TableCell className="p-4 text-sm text-gray-600">{treatment.patientGender}</TableCell>
                    <TableCell className="p-4">
                    <Dialog>
                        <DialogTrigger asChild>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                            handleViewDetails(treatment.patientName);
                            setSelectedTreatment(null); // Reset selected treatment
                            }}
                            className="hover:bg-blue-50 transition-colors duration-200"
                        >
                            View Details
                        </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] max-h-[80vh] overflow-y-auto rounded-lg shadow-xl">
                        <DialogHeader className="border-b pb-3">
                            <DialogTitle className="text-xl font-semibold text-gray-800 flex items-center">
                            <FileText className="mr-2 text-blue-500" />
                            Treatment Details for {treatment.patientName}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="p-2">
                            {selectedPatientTreatments.length > 0 ? (
                            <Table>
                                <TableHeader className="bg-gray-100">
                                <TableRow>
                                    <TableHead className="text-gray-600 font-medium">Illnesses</TableHead>
                                    <TableHead className="text-gray-600 font-medium">Severity</TableHead>
                                    <TableHead className="text-gray-600 font-medium">Notes</TableHead>
                                    <TableHead className="text-gray-600 font-medium">Medicines</TableHead>
                                    <TableHead className="text-gray-600 font-medium">Medicine Count</TableHead>
                                    <TableHead className="text-gray-600 font-medium">Date</TableHead>
                                </TableRow>
                                </TableHeader>
                                <TableBody>
                                {selectedPatientTreatments.map((pt) => (
                                    <TableRow 
                                    key={pt.treatmentId} 
                                    onClick={() => setSelectedTreatment(pt)}
                                    className="cursor-pointer hover:bg-blue-50 transition-colors duration-150 group"
                                    >
                                    <TableCell className="group-hover:text-blue-600">
                                        {pt.illnesses?.map((illness) => illness.illnessName).join(', ') || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge 
                                        variant={
                                            pt.severity.toLowerCase() === 'mild' ? 'outline' :
                                            pt.severity.toLowerCase() === 'moderate' ? 'secondary' :
                                            'destructive'
                                        }
                                        className={getSeverityColor(pt.severity)}
                                        >
                                        {pt.severity}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-600">{truncateNotes(pt.notes, 50)}</TableCell>
                                    <TableCell>{pt.medicines.map((m) => m.medicineName).join(', ')}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{pt.medicinesUsedCount}</Badge>
                                    </TableCell>
                                    <TableCell className="text-gray-500">
                                        {new Date(pt.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                            ) : (
                            <div className="text-center py-4 text-gray-500">
                                <AlertCircle className="mx-auto mb-2 text-gray-400" />
                                <p>No treatments found for this patient</p>
                            </div>
                            )}
                        </div>
                        </DialogContent>
                    </Dialog>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
        </div>

        <div className="flex justify-center mt-6 space-x-2">
            {Array(Math.ceil(filteredTreatments.length / itemsPerPage))
            .fill(0)
            .map((_, index) => (
                <Button
                key={index + 1}
                variant={currentPage === index + 1 ? 'default' : 'outline'}
                onClick={() => paginate(index + 1)}
                className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    currentPage === index + 1 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
                >
                {index + 1}
                </Button>
            ))}
        </div>
        </CardContent>

        {/* Detailed Treatment Modal */}
        <TreatmentDetailsDialog 
        selectedTreatment={selectedTreatment} 
        onClose={handleCloseDetailsDialog} 
        />
    </Card>
    )
}