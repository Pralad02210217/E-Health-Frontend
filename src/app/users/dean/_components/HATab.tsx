import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchHADetailsFn, changeHAStatusFn } from '@/lib/api';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, UserPlus, Mail, Phone, AlertCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SignUpHADialog } from './RegisterDialog';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface HA {
  id: string;
  name: string;
  gender: string;
  email: string;
  status: string;
  contact_number: string;
  is_available: boolean;
  is_onLeave: boolean;
}

const HAVisitsTab = () => {
  const queryClient = useQueryClient();
  const { data: haDetailsData, isLoading, isError, error } = useQuery({
    queryKey: ['haDetails'],
    queryFn: fetchHADetailsFn,
  });

  const [open, setOpen] = useState(false);
  const [selectedHA, setSelectedHA] = useState<HA | null>(null);
  const [status, setStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredHA, setFilteredHA] = useState<HA[]>([]);
  const itemsPerPage = 5; // You can adjust this value based on your preference

  const haDetails = haDetailsData?.data.haDetails || [];

  // Filter and paginate HA details
  useEffect(() => {
    if (haDetails.length) {
      const filtered = haDetails.filter((ha: HA) => {
        const query = searchQuery.toLowerCase();
        return (
          ha.name.toLowerCase().includes(query) ||
          ha.email.toLowerCase().includes(query) ||
          ha.status.toLowerCase().includes(query) ||
          ha.gender.toLowerCase().includes(query)
        );
      });
      
      setFilteredHA(filtered);
      
      // Reset to first page when search query changes
      if (searchQuery) {
        setCurrentPage(1);
      }
    } else {
      setFilteredHA([]);
    }
  }, [searchQuery, haDetails]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredHA.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHA = filteredHA.slice(startIndex, startIndex + itemsPerPage);
  
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

  const { mutate: updateHAStatus, isPending: isUpdating, isError: isUpdateError, error: updateError } = useMutation({
    mutationFn: ({ id, data }:{id:string, data:{status:string}}) => changeHAStatusFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['haDetails']});
      setOpen(false);
      setSelectedHA(null);
      setStatus('');
      toast({
        title: 'Status Updated',
        description: 'The status has been updated successfully.',
        variant: 'default',
      });
    },
    onError: (error:any) => {
      toast({
        title: 'Error',
        description: `Failed to update status: ${error.data?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleViewDetails = (ha:HA) => {
    setSelectedHA(ha);
    setStatus(ha.status);
    setOpen(true);
  };

  const handleStatusChange = (newStatus:string) => {
    setStatus(newStatus);
  };

  const handleUpdateStatus = () => {
    if (selectedHA?.id && status) {
      updateHAStatus({ id: selectedHA.id, data: { status } });
    }
  };

  const getStatusBadge = (status:string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Active</Badge>;
      case 'INACTIVE':
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Inactive</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            Error Loading Data
          </CardTitle>
          <CardDescription>
            We encountered a problem while fetching the HA details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">{error?.message || 'Unknown error occurred'}</p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['haDetails']})}
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
        <h2 className="text-2xl font-semibold tracking-tight">Health Assistant Management Dashboard</h2>
        <SignUpHADialog />
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Health Assistants</CardTitle>
          <CardDescription>
            Manage your Health assistants and their availability status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, status, or gender..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {paginatedHA.length > 0 ? (
            <>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedHA.map((ha:HA) => (
                      <TableRow key={ha.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{ha.name}</TableCell>
                        <TableCell>{ha.gender}</TableCell>
                        <TableCell className="max-w-xs truncate">{ha.email}</TableCell>
                        <TableCell>{getStatusBadge(ha.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline" onClick={() => handleViewDetails(ha)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
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
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredHA.length)} of {filteredHA.length} entries
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
                No health assistants found matching "{searchQuery}".
              </p>
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Home Assistants Found</h3>
              <p className="text-muted-foreground mt-2 mb-6 max-w-md">
                You haven't added any home assistants yet. Click the register button to add your first HA.
              </p>
              <SignUpHADialog />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md md:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl">HA Details</DialogTitle>
            <DialogDescription>
              View and update the status of this home assistant
            </DialogDescription>
          </DialogHeader>
          {selectedHA && (
            <div className="py-4">
              <div className="flex flex-col space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedHA.name}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-muted-foreground">Gender</Label>
                    <p className="font-medium">{selectedHA.gender}</p>
                  </div>
                  <div className="space-y-1 flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <p className="font-medium break-all">{selectedHA.email}</p>
                    </div>
                  </div>
                  <div className="space-y-1 flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label className="text-sm text-muted-foreground">Contact Number</Label>
                      <p className="font-medium">{selectedHA.contact_number}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mt-2">
                  <div className="rounded-md bg-muted px-3 py-2">
                    <Label className="text-xs text-muted-foreground block">Availability</Label>
                    <Badge className={selectedHA.is_available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {selectedHA.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                  <div className="rounded-md bg-muted px-3 py-2">
                    <Label className="text-xs text-muted-foreground block">Leave Status</Label>
                    <Badge className={selectedHA.is_onLeave ? "bg-amber-100 text-amber-800" : "bg-blue-100 text-blue-800"}>
                      {selectedHA.is_onLeave ? 'On Leave' : 'On Duty'}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-4">
                <Label htmlFor="status" className="block mb-2">Update Status</Label>
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem 
                        value="ACTIVE" 
                        disabled={selectedHA?.status === "ACTIVE"}
                    >
                        ACTIVE
                    </SelectItem>
                    <SelectItem 
                        value="INACTIVE" 
                        disabled={selectedHA?.status === "ACTIVE"}
                    >
                        INACTIVE
                    </SelectItem>
                    </SelectContent>
                </Select>
                </div>
                {isUpdateError && (
                  <div className="mt-2 rounded-md bg-red-50 p-3 text-red-800 text-sm">
                    <p className="flex items-center gap-2">
                      <AlertCircle size={16} />
                      {updateError?.message || 'Error updating status'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button 
              onClick={handleUpdateStatus} 
              disabled={isUpdating || !selectedHA || status === selectedHA?.status}
              className="gap-2 font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90"
            >
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HAVisitsTab;