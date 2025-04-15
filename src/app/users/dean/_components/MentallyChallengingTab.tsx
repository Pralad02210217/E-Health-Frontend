import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMentalIssuesFn, updateMentalIssuesFn, fetchProgrammesFn } from '@/lib/api';

interface MentalCase {
  std_year?: string;
  case_id: string;
  name: string;
  gender: string;
  department_id: string;
  contact_number: string;
  email: string;
  created_at: string;
  action_taken?: string;
  resolved?: boolean;
}

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, AlertCircle, Search, ChevronLeft, ChevronRight, Calendar, Phone, Mail, User, Building2, FileText, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const MentallyChallengedTab = () => {
  const queryClient = useQueryClient();
  const { data: mentalIssuesData, isLoading: isIssuesLoading, isError: isIssuesError, error: issuesError } = useQuery({
    queryKey: ['mentalIssues'],
    queryFn: fetchMentalIssuesFn,
  });

  const { data: programmesData, isLoading: isProgrammesLoading, isError: isProgrammesError, error: programmesError } = useQuery({
    queryKey: ['programmes'],
    queryFn: fetchProgrammesFn,
  });

  const [open, setOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<MentalCase | null>(null);
  const [actionTaken, setActionTaken] = useState('');
  const [isResolved, setIsResolved] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredCases, setFilteredCases] = useState<MentalCase[]>([]);
  const itemsPerPage = 5;

  const cases = mentalIssuesData?.data.cases || [];
  const programmes = programmesData?.data.departments || [];
console.log(cases)

  // Filter and paginate cases
  useEffect(() => {
    if (cases.length) {
      const filtered = cases.filter((caseItem: MentalCase) => {
        const query = searchQuery.toLowerCase();
        const departmentName = getDepartmentName(caseItem.department_id).toLowerCase();
        return (
          caseItem.name.toLowerCase().includes(query) ||
          caseItem.gender.toLowerCase().includes(query) ||
          departmentName.includes(query) ||
          (caseItem.email && caseItem.email.toLowerCase().includes(query))
        );
      });
      
      setFilteredCases(filtered);
      
      // Reset to first page when search query changes
      if (searchQuery) {
        setCurrentPage(1);
      }
    } else {
      setFilteredCases([]);
    }
  }, [searchQuery, cases, programmes]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredCases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCases = filteredCases.slice(startIndex, startIndex + itemsPerPage);
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const { mutate: updateCase, isPending: isUpdating, isError: isUpdateError, error: updateError } = useMutation({
    mutationFn: ({ id, data }:{id:string, data:{action_taken:string, is_resolved:boolean}}) => updateMentalIssuesFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentalIssues']});
      setOpen(false);
      setSelectedCase(null);
      setActionTaken('');
      setIsResolved('');
    },
  });

  const handleViewDetails = (caseItem:MentalCase) => {
    setSelectedCase(caseItem);
    setActionTaken(caseItem.action_taken || '');
    setIsResolved(caseItem.resolved ? 'yes' : 'no');
    setOpen(true);
  };

  const handleActionTakenChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setActionTaken(e.target.value);
  };

  const handleResolvedChange = (value:string) => {
    setIsResolved(value);
  };

  const handleUpdateCase = () => {
    if (selectedCase?.case_id) {
      updateCase({
        id: selectedCase.case_id,
        data: { action_taken: actionTaken, is_resolved: isResolved === 'yes' },
      });
    }
  };

  const getDepartmentName = (departmentId:string) => {
    const department = programmes.find((prog:any) => prog.programme_id === departmentId);
    return department ? department.programme_name : departmentId;
  };

  const formatDate = (dateString:string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (isIssuesLoading || isProgrammesLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <Skeleton className="h-8 w-64" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isIssuesError || isProgrammesError) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            Error Loading Data
          </CardTitle>
          <CardDescription>
            We encountered a problem while fetching the required data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isIssuesError && (
            <p className="text-red-600 mb-2">Error loading Mental Health Cases: {issuesError?.message}</p>
          )}
          {isProgrammesError && (
            <p className="text-red-600">Error loading Department Details: {programmesError?.message}</p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['mentalIssues']});
              queryClient.invalidateQueries({ queryKey: ['programmes']});
            }}
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Mental Health Support Cases</h2>
      </div>

      <Card className="w-full border-t-4 border-t-indigo-500">
        <CardHeader>
          <CardTitle>Mental Health Cases Overview</CardTitle>
          <CardDescription>
            Manage and track student mental health cases and interventions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, gender, department..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {paginatedCases.length > 0 ? (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Reported On</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCases.map((caseItem: MentalCase) => (
                      <TableRow key={caseItem.case_id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{caseItem.name}</TableCell>
                        <TableCell>{caseItem.gender}</TableCell>
                        <TableCell>{caseItem.std_year? caseItem.std_year: "Not-Student"}</TableCell>
                        <TableCell>{getDepartmentName(caseItem.department_id)}</TableCell>
                        <TableCell>{formatDate(caseItem.created_at)}</TableCell>
                        <TableCell>
                          {caseItem.resolved ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                              Resolved
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-200">
                              In Progress
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(caseItem)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredCases.length)} of {filteredCases.length} cases
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous Page</span>
                  </Button>
                  <div className="text-sm font-medium">
                    Page {currentPage} of {Math.max(1, totalPages)}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next Page</span>
                  </Button>
                </div>
              </div>
            </>
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Search Results</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                No mental health cases found matching "{searchQuery}".
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Mental Health Cases</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                There are currently no mental health cases recorded in the system.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh]  overflow-scroll">
          <DialogHeader>
            <DialogTitle className="text-xl">Mental Health Case Details</DialogTitle>
            <DialogDescription>
              View case information and update intervention status
            </DialogDescription>
          </DialogHeader>
          {selectedCase && (
            <div className="py-4">
              <div className="flex flex-col space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1 flex items-start gap-2">
                      <User className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <Label className="text-sm text-muted-foreground">Name</Label>
                        <p className="font-medium">{selectedCase.name}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Gender</Label>
                      <p className="font-medium">{selectedCase.gender}</p>
                    </div>
                    <div className="space-y-1 flex items-start gap-2">
                      <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <Label className="text-sm text-muted-foreground">Department</Label>
                        <p className="font-medium">{getDepartmentName(selectedCase.department_id)}</p>
                      </div>
                    </div>
                    <div className="space-y-1 flex items-start gap-2">
                      <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <Label className="text-sm text-muted-foreground">Contact Number</Label>
                        <p className="font-medium">{selectedCase.contact_number}</p>
                      </div>
                    </div>
                    <div className="space-y-1 flex items-start gap-2">
                      <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <Label className="text-sm text-muted-foreground">Email</Label>
                        <p className="font-medium break-all">{selectedCase.email}</p>
                      </div>
                    </div>
                    <div className="space-y-1 flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                      <div>
                        <Label className="text-sm text-muted-foreground">Reported On</Label>
                        <p className="font-medium">{formatDate(selectedCase.created_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <Label htmlFor="action_taken" className="text-md font-medium mb-2 block">Action Taken / Intervention Notes</Label>
                  <Textarea
                    id="action_taken"
                    value={actionTaken}
                    onChange={handleActionTakenChange}
                    placeholder="Enter details of actions taken, interventions provided, or support strategies implemented..."
                    className="min-h-28"
                  />
                </div>
                
                <div>
                  <Label htmlFor="resolved" className="text-md font-medium mb-2 block">Case Resolution Status</Label>
                  <Select value={isResolved} onValueChange={handleResolvedChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Resolution Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                          <span>Resolved</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="no">
                        <div className="flex items-center">
                          <XCircle className="h-4 w-4 mr-2 text-amber-600" />
                          <span>In Progress</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {isUpdateError && (
                  <div className="mt-2 rounded-md bg-red-50 p-3 text-red-800 text-sm">
                    <p className="flex items-center gap-2">
                      <AlertCircle size={16} />
                      {updateError?.message || 'Error updating case details'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCase} 
              disabled={isUpdating || !selectedCase}
              className="gap-2 font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:opacity-90"
            >
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MentallyChallengedTab;