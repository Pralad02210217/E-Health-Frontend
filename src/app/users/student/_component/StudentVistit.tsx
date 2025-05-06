'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar as CalendarIcon, Filter, Eye, RefreshCw } from 'lucide-react';
import useAuth from '@/hooks/use-auth';
import { fetchProgrammesFn, fetchStudentTreatmentFn } from '@/lib/api';
import StudentTreatmentDetailsDialog from './StudentDetailModal';

const StudentHealthVisitsPage = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSearchCalendarOpen, setIsSearchCalendarOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    studentNumber: "",
    department: ""
  });
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("filter");

  // Fetch treatments data
  const { data: treatmentsData, isLoading: treatmentsLoading, isError: treatmentsError } = useQuery({
    queryKey: ['studentTreatments'],
    queryFn: fetchStudentTreatmentFn,
  });

  // Fetch programmes data
  const { data: programmesData, isLoading: programmesLoading, isError: programmesError } = useQuery({
    queryKey: ['programmes'],
    queryFn: fetchProgrammesFn,
  });

  // Map programmes data to the format expected by the component
  const departments = useMemo(() => {
    if (!programmesData?.data.departments) return [];
    return programmesData?.data.departments.map((prog: any) => ({
      id: prog.programme_id,
      name: prog.programme_name
    }));
  }, [programmesData]);

  // Reset all filters to default values
  const resetFilters = () => {
    setSelectedDate(new Date());
    setIsCalendarOpen(false);
  };

  // Reset search parameters
  const resetSearch = () => {
    setSearchParams({ studentNumber: "", department: "" });
    setIsSearching(false);
  };

  // Handle tab change
  const handleTabChange = (value:any) => {
    setActiveTab(value);
    // Reset the filters for the destination tab
    if (value === "filter") {
      resetFilters();
      resetSearch();
    } else if (value === "search") {
      resetSearch();
    }
  };

  // Filter data based on selected date, departments, and search params
  const filteredTreatments = useMemo(() => {
    if (!treatmentsData?.data?.treatments) return [];
    
    let filtered = treatmentsData.data.treatments;
    
    // Date filtering
    filtered = filtered.filter((treatment:any) => {
      const treatmentDate = format(new Date(treatment.createdAt), 'yyyy-MM-dd');
      return treatmentDate === format(selectedDate, 'yyyy-MM-dd');
    });
    
    // Filter by user's department in Filter tab
    if (activeTab === "filter" && user?.department_id) {
      filtered = filtered.filter((treatment:any) => treatment.departmentId === user.department_id);
    }
    
    // Search filtering
    if (isSearching) {
      filtered = filtered.filter((treatment:any) => {
        const studentMatchesSearch = !searchParams.studentNumber || 
                                   treatment.studentNumber === searchParams.studentNumber;
        const departmentMatchesSearch = !searchParams.department || 
                                      treatment.departmentId === searchParams.department;
        return studentMatchesSearch && departmentMatchesSearch;
      });
    }
    
    return filtered;
  }, [treatmentsData, selectedDate, searchParams, isSearching, user, activeTab]);

  const handleSearch = () => {
    setIsSearching(true);
  };

  const handleViewDetails = (treatment:any) => {
    setSelectedTreatment(treatment);
    setIsModalOpen(true);
  };

  const handleDateSelect = (date:any) => {
    setSelectedDate(date);
    setIsCalendarOpen(false); // Close the popover after selection
  };

  const handleSearchDateSelect = (date:any) => {
    setSelectedDate(date);
    setIsSearchCalendarOpen(false); // Close the search tab popover after selection
  };

  const getSeverityBadge = (severity:any) => {
    switch(severity.toUpperCase()) {
      case 'MILD':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">No Rest Required</Badge>;
      case 'MODERATE':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Maybe Rest Required</Badge>;
      case 'SEVERE':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Rest Required</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  const getDepartmentName = (departmentId:string) => {
    const department = departments.find((dept:any) => dept.id === departmentId);
    return department ? department.name : departmentId;
  };

  // Combined loading state
  const isLoading = treatmentsLoading || programmesLoading;
  
  // Combined error state
  const isError = treatmentsError || programmesError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl font-medium">Loading data...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-[450px]">
          <CardHeader className="bg-red-50">
            <CardTitle className="text-red-600">Error Loading Data</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p>There was a problem fetching data. Please try again later or contact support.</p>
            <Button className="mt-4 w-full" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Student Health Visits</h1>
      
      <Tabs defaultValue="filter" className="mb-8" onValueChange={handleTabChange}>
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="filter">
            <Filter className="mr-2 h-4 w-4" />
            My Department Visits
          </TabsTrigger>
          <TabsTrigger value="search">
            <Search className="mr-2 h-4 w-4" />
            Other Department Search Visits
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="filter" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Date Filter with Popover */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Date</Label>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedDate(new Date());
                        setIsCalendarOpen(false);
                      }}
                      className="h-8"
                    >
                      Today
                    </Button>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(selectedDate, 'MMM d, yyyy')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="bg-muted p-2 rounded-md text-sm">
                    Showing records for <span className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</span>
                    {user?.department_id && (
                      <span> from <span className="font-medium">{getDepartmentName(user.department_id)}</span> department</span>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetFilters}
                    className="h-8"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="search" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Search Other Department</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student-number">Student Number</Label>
                  <Input
                    id="student-number"
                    placeholder="Enter student ID"
                    value={searchParams.studentNumber}
                    onChange={(e) => setSearchParams({...searchParams, studentNumber: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={searchParams.department}
                    onValueChange={(value) => setSearchParams({...searchParams, department: value})}
                  >
                    <SelectTrigger id="department">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept:any) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Added Date Selection to Search Tab */}
              <div className="space-y-2 mt-4">
                <Label className="text-base">Date</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedDate(new Date());
                      setIsSearchCalendarOpen(false);
                    }}
                    className="h-8"
                  >
                    Today
                  </Button>
                  <Popover open={isSearchCalendarOpen} onOpenChange={setIsSearchCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(selectedDate, 'MMM d, yyyy')}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSearchDateSelect}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 mt-4">
                {isSearching && (
                  <Button variant="outline" onClick={resetSearch}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
                <Button 
                  onClick={handleSearch}
                  disabled={!searchParams.studentNumber && !searchParams.department}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Results Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Student Visits</CardTitle>
          <div className="text-sm text-muted-foreground">
            {format(selectedDate, 'MMMM d, yyyy')} • {filteredTreatments.length} records
          </div>
        </CardHeader>
        <CardContent>
          {filteredTreatments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Visit Time</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTreatments.map((treatment:any) => {
                    const createdAt = new Date(treatment.createdAt);
                    return (
                      <TableRow key={treatment.treatmentId}>
                        <TableCell className="font-medium">{treatment.patientName}</TableCell>
                        <TableCell>{getDepartmentName(treatment.departmentId)}</TableCell>
                        <TableCell>{format(createdAt, 'h:mm a')}</TableCell>
                        <TableCell>{getSeverityBadge(treatment.severity)}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(treatment)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="text-muted-foreground">No records found for the selected criteria</div>
              {isSearching && (
                <Button variant="link" onClick={resetSearch}>
                  Reset search filters
                </Button>
              )}
              {activeTab === "filter" && (
                <Button variant="link" onClick={resetFilters}>
                  Reset date filter
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
        {/* Replace the existing dialog with this */}
        <StudentTreatmentDetailsDialog
        open={isModalOpen}
        selectedTreatment={selectedTreatment}
        onClose={() => {
            setIsModalOpen(false);
            setSelectedTreatment(null); // Clear selection when closing
        }}
        />
    </div>
  );
};

export default StudentHealthVisitsPage;