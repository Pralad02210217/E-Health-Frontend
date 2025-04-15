import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchStaffFn, updateStaffRoleFn, fetchProgrammesFn } from '@/lib/api';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Search, User, Users, Building2, Phone, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from '@/hooks/use-toast';

interface Staff {
  id: string;
  name: string;
  gender: string;
  department_id: string;
  userType: string;
  contact_number: string;
}

const RoleControlTab = () => {
  const queryClient = useQueryClient();
  const { data: staffData, isLoading: isStaffLoading, isError: isStaffError, error: staffError } = useQuery<{ data: { staff: Staff[] } }>({
    queryKey: ['staff'],
    queryFn: fetchStaffFn,
  });

  const { data: programmesData, isLoading: isProgrammesLoading, isError: isProgrammesError, error: programmesError } = useQuery({
    queryKey: ['programmes'],
    queryFn: fetchProgrammesFn,
  });

  const [open, setOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [userType, setUserType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const staffDetails = staffData?.data.staff || [];
  const programmes = programmesData?.data.departments || [];

  // Define getDepartmentName function BEFORE it's used in filteredStaff
  const getDepartmentName = (departmentId: string) => {
    const department = programmes.find((prog: any) => prog.programme_id === departmentId);
    return department ? department.programme_name : departmentId;
  };

  // Filter staff based on search query
  const filteredStaff = staffDetails.filter((staff: Staff) => {
    const departmentName = getDepartmentName(staff.department_id).toLowerCase();
    return (
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.userType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      departmentName.includes(searchQuery.toLowerCase())
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const { mutate: updateRole, isPending: isUpdating, isError: isUpdateError, error: updateError } = useMutation({
    mutationFn: ({ id, data }:{id:string, data:{type:string}}) => updateStaffRoleFn(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff']});
      setOpen(false);
      setSelectedStaff(null);
      setUserType('');
      toast({
        title: 'Role Updated',
        description: 'Staff role has been updated successfully.',
        variant: 'default',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to update role: ${error.data?.message || 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });

  const handleViewDetails = (staff: Staff) => {
    setSelectedStaff(staff);
    setUserType(staff.userType);
    setOpen(true);
  };

  const handleUserTypeChange = (newType: string) => {
    setUserType(newType);
  };

  const handleUpdateRole = () => {
    if (selectedStaff?.id && userType) {
      updateRole({ id: selectedStaff.id, data: { type: userType } });
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'DEAN':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200">Dean</Badge>;
      case 'STAFF':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Staff</Badge>;
      default:
        return <Badge>{role}</Badge>;
    }
  };

  if (isStaffLoading || isProgrammesLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-36" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
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

  if (isStaffError || isProgrammesError) {
    return (
      <Card className="w-full border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertCircle size={20} />
            Error Loading Data
          </CardTitle>
          <CardDescription>
            We encountered a problem while fetching data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">
            {isStaffError ? staffError?.message : programmesError?.message || 'Unknown error occurred'}
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['staff']});
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
        <h2 className="text-2xl font-semibold tracking-tight">Staff Role Management</h2>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Staff Directory</CardTitle>
          <CardDescription>
            View and manage roles for your staff members.
          </CardDescription>
          <div className="flex items-center space-x-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, role, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredStaff.length > 0 ? (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedStaff.map((staff) => (
                    <TableRow key={staff.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{staff.name}</TableCell>
                      <TableCell>{staff.gender}</TableCell>
                      <TableCell>{getDepartmentName(staff.department_id)}</TableCell>
                      <TableCell>{getRoleBadge(staff.userType)}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(staff)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No Staff Found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {searchQuery ? 
                  "No staff members match your search criteria. Try adjusting your search." : 
                  "There are no staff members in the system yet."}
              </p>
            </div>
          )}
        </CardContent>
        {filteredStaff.length > 0 && (
          <CardFooter className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} staff
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm font-medium">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">Staff Details</DialogTitle>
            <DialogDescription>
              View information and update role for this staff member
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="py-4">
              <div className="flex flex-col space-y-6">
                <div className="flex justify-center">
                  <div className="p-2 rounded-full bg-muted">
                    <User className="h-16 w-16 text-primary" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1 flex items-start gap-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Name</Label>
                      <p className="font-medium">{selectedStaff.name}</p>
                    </div>
                  </div>
                  <div className="space-y-1 flex items-start gap-2">
                    <div>
                      <Label className="text-sm text-muted-foreground">Gender</Label>
                      <p className="font-medium">{selectedStaff.gender}</p>
                    </div>
                  </div>
                  <div className="space-y-1 flex items-start gap-2">
                    <Building2 className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label className="text-sm text-muted-foreground">Department</Label>
                      <p className="font-medium">{getDepartmentName(selectedStaff.department_id)}</p>
                    </div>
                  </div>
                  <div className="space-y-1 flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <Label className="text-sm text-muted-foreground">Contact Number</Label>
                      <p className="font-medium">{selectedStaff.contact_number}</p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-md bg-muted/50 p-4">
                  <Label htmlFor="userType" className="block mb-2 font-medium">User Role</Label>
                  <Select value={userType} onValueChange={handleUserTypeChange}>
                    <SelectTrigger className="w-full bg-background">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STAFF">STAFF</SelectItem>
                      <SelectItem value="DEAN">DEAN</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-2">
                    {userType === 'DEAN' ? 
                      "Deans have administrative access to all department functions." : 
                      "Staff members have standard access to department resources."}
                  </p>
                </div>
                
                {isUpdateError && (
                  <div className="rounded-md bg-red-50 p-3 text-red-800 text-sm">
                    <p className="flex items-center gap-2">
                      <AlertCircle size={16} />
                      {updateError?.message || 'Error updating role'}
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
              onClick={handleUpdateRole} 
              disabled={isUpdating || !selectedStaff || userType === selectedStaff?.userType}
              className="gap-2"
            >
              {isUpdating ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoleControlTab;