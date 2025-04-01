'use client'
import React, { useState } from 'react';
import { Loader } from "lucide-react";
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQuery } from '@tanstack/react-query';

import { fetchDashboardFn } from '@/lib/api';
import OverviewSection from './OverViewSection';
import IllnessesSection from './IllnessSection';
import MedicationsSection from './MedicationSection';
import PatientsSection from './PatientSection';

const DashboardFinal = () => {
  const [timeFilter, setTimeFilter] = useState('all');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [medicineTypeFilter, setMedicineTypeFilter] = useState('all');
  
  const { data: dashboardData1, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardFn,
  });

  if (isLoading){

    return (
        <Loader className='animate-spin'/>
    )
  }
  if (!dashboardData1) return null;

  const data = dashboardData1.data.data;

  // Data processing functions (keep these in the main component)
  const summaryStats = [
    { title: 'Total Treatments', value: data.totalTreatments, color: 'bg-blue-100' },
    { title: 'Medicines Dispensed', value: Math.abs(parseInt(data.totalMedicinesDispensed)), color: 'bg-green-100' },
    { title: 'Out of Stock Medicines', value: data.inventoryHealthSummary.outOfStockCount, color: 'bg-red-100' },
    { title: 'Medicines Expiring Soon', value: `${data.inventoryHealthSummary.expiringSoonPercentage}%`, color: 'bg-yellow-100' }
  ];

  const illnessChartData = data.mostTreatedIllnesses.map((item:any) => ({
    name: item.illness_name,
    count: item.count,
    type: item.illness_type
  }));

  const medicineChartData = data.mostPrescribedMedicines
    .filter((item: { category_name: string; }) => medicineTypeFilter === 'all' || item.category_name === medicineTypeFilter)
    .map((item: { medicine_name: any; count: any; category_name: any; }) => ({
      name: item.medicine_name,
      count: item.count,
      type: item.category_name
    }));

  const severityData = data.treatmentSeverity.map((item: any) => ({
    name: item.severity,
    value: item.count
  }));

  const demographicsData = data.patientDemographics
    .filter((item: any) => userTypeFilter === 'all' || item.userType === userTypeFilter)
    .map((item: { userType: any; count: any; }) => ({
      name: item.userType,
      count: item.count
    }));

  const inventoryData = data.medicineInventory
    .filter((item: { total_quantity: string; }) => parseInt(item.total_quantity) > 0)
    .sort((a: { total_quantity: string; }, b: { total_quantity: string; }) => parseInt(b.total_quantity) - parseInt(a.total_quantity))
    .slice(0, 5)
    .map((item: { medicine_name: any; total_quantity: string; expiring_soon_count: any; }) => ({
      name: item.medicine_name,
      quantity: parseInt(item.total_quantity),
      expiring: item.expiring_soon_count
    }));

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header and Filters remain here */}
      {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="py-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="time-filter" className="text-sm font-medium">Time Period</label>
                    <Select value={timeFilter} onValueChange={setTimeFilter}>
                      <SelectTrigger id="time-filter">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        <SelectItem value="2025-03">March 2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
      
              <Card>
                <CardContent className="py-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="user-type-filter" className="text-sm font-medium">User Type</label>
                    <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                      <SelectTrigger id="user-type-filter">
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="HA">HA</SelectItem>
                        <SelectItem value="STUDENT">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
      
              <Card>
                <CardContent className="py-4">
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="medicine-type-filter" className="text-sm font-medium">Medicine Type</label>
                    <Select value={medicineTypeFilter} onValueChange={setMedicineTypeFilter}>
                      <SelectTrigger id="medicine-type-filter">
                        <SelectValue placeholder="Select medicine type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Drug">Drug</SelectItem>
                        <SelectItem value="Non-Drug">Non-Drug</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
      
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {summaryStats.map((stat, index) => (
                <Card key={index} className={stat.color}>
                  <CardContent className="p-6">
                    <div className="flex flex-col space-y-1.5">
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h2 className="text-3xl font-bold">{stat.value}</h2>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
      
      
      {/* {parseInt(data.totalMedicinesDispensed) < 0 && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-400">
          <AlertDescription>
            There appears to be an issue with the medicine dispensed data showing negative values.
          </AlertDescription>
        </Alert>
      )} */}

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="illnesses">Illnesses</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OverviewSection
            summaryStats={summaryStats}
            severityData={severityData}
            doctorWorkload={data.doctorWorkload}
            inventoryData={inventoryData}
            demographicsData={demographicsData}
            userByGender = {data.usersByGender}
          />
        </TabsContent>

        <TabsContent value="illnesses">
          <IllnessesSection illnessChartData={illnessChartData} />
        </TabsContent>

        <TabsContent value="medications">
          <MedicationsSection
            medicineChartData={medicineChartData}
            medicineInventory={data.medicineInventory}
            medicineUsageOverTime={data.medicineUsageOverTime}
          />
        </TabsContent>

        <TabsContent value="patients">
          <PatientsSection
            ageGroupsData={data.ageGroups}
            genderData={data.treatmentsByGender}
            studentProgramStats={data.studentProgramStats}
            familyMemberTreatments={data.familyMemberTreatments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardFinal;