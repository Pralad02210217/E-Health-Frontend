'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchDashboardFn } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Calendar, Loader2, Pill, UserCheck, Users } from 'lucide-react';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const SEVERITY_COLORS = {
  MILD: '#10b981',
  MODERATE: '#f59e0b',
  SEVERE: '#ef4444',
};

export default function DashboardCharts() {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardFn,
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const {
    totalTreatments,
    mostTreatedIllnesses,
    mostPrescribedMedicines,
    totalMedicinesDispensed,
    patientDemographics,
    treatmentSeverity,
    medicineInventory,
    doctorWorkload,
    treatmentsOverTime,
    treatmentsByGender,
    ageGroups,
    familyMemberTreatments,
    studentProgramStats,
    medicineUsageOverTime,
    inventoryHealthSummary,
  } = dashboardData?.data.data || {};

  // Data transformation helpers
  const fixedMedicinesDispensed = Math.abs(parseInt(totalMedicinesDispensed || '0'));
  const totalPatients = patientDemographics?.reduce((sum: any, item: any) => sum + item.count, 0) || 0;
  const trimmedMedicines = mostPrescribedMedicines?.map((med: { medicine_name: string; }) => ({
    ...med,
    display_name: med.medicine_name.length > 12 
      ? `${med.medicine_name.substring(0, 10)}...` 
      : med.medicine_name
  }));
  const fixNegativeValues = (data: any[]) => data?.map(item => ({
    ...item,
    total_used: Math.abs(parseInt(item.total_used))
  })) || [];

  if (isLoading) {
    return (
      <Card className="w-full max-w-7xl mx-auto shadow-md">
        <CardContent className="flex justify-center items-center py-16">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="ml-3 text-lg font-medium">Loading dashboard data...</span>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-7xl mx-auto bg-red-50 border-red-200">
        <CardContent className="flex justify-center items-center py-8">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <span className="ml-2 text-red-700">Error loading dashboard data</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Healthcare Dashboard</h1>
        <div className="text-sm text-gray-500">Last Updated: {new Date().toLocaleDateString()}</div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Total Treatments</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Calendar className="h-10 w-10 text-indigo-500 mr-3" />
              <div className="text-3xl font-bold text-gray-900">{totalTreatments || 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Medicines Dispensed</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Pill className="h-10 w-10 text-cyan-500 mr-3" />
              <div className="text-3xl font-bold text-gray-900">{fixedMedicinesDispensed}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Total Doctors</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <UserCheck className="h-10 w-10 text-emerald-500 mr-3" />
              <div className="text-3xl font-bold text-gray-900">{doctorWorkload?.length || 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Total Patients</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Users className="h-10 w-10 text-amber-500 mr-3" />
              <div className="text-3xl font-bold text-gray-900">{totalPatients}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Health Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Total Medicines</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <Pill className="h-10 w-10 text-purple-500 mr-3" />
              <div className="text-3xl font-bold text-gray-900">{inventoryHealthSummary?.totalMedicines || 0}</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <AlertTriangle className="h-10 w-10 text-amber-500 mr-3" />
              <div className="text-3xl font-bold text-gray-900">
                {inventoryHealthSummary?.expiringSoonPercentage || 0}%
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-700">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center">
              <AlertTriangle className="h-10 w-10 text-red-500 mr-3" />
              <div className="text-3xl font-bold text-gray-900">{inventoryHealthSummary?.outOfStockCount || 0}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Most Treated Illnesses</CardTitle>
            <CardDescription>Number of treatments by illness type</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mostTreatedIllnesses || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="illness_name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }} />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Age Distribution</CardTitle>
            <CardDescription>Patient age groups distribution</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageGroups || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="age_group" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '0.5rem', 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                  border: 'none' 
                }} />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Demographic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Patient Demographics</CardTitle>
            <CardDescription>Distribution by user type</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={patientDemographics || []} 
                  dataKey="count" 
                  nameKey="userType" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={100}
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {patientDemographics?.map((entry: any, index: any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} patients`]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Family Member Treatments</CardTitle>
            <CardDescription>Treatments by family relationship</CardDescription>
          </CardHeader>
          <CardContent className="h-72 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={familyMemberTreatments || []}
                  dataKey="count"
                  nameKey="relation"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {familyMemberTreatments?.map((entry: any, index:any) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} treatments`]}
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Medicine and Student Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Student Program Statistics</CardTitle>
            <CardDescription>Treatments by student program</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentProgramStats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="programme_name" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle>Medicine Usage Over Time</CardTitle>
            <CardDescription>Monthly medicine usage trends</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={fixNegativeValues(medicineUsageOverTime) || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => 
                    new Date(value).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
                  }
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '0.5rem', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                    border: 'none' 
                  }}
                  labelFormatter={(value) => 
                    new Date(value).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="total_used" 
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 6, strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Sections */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Medicine Inventory (Expiring Soon)</CardTitle>
          <CardDescription>Medicines that need attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medicine Name</TableHead>
                  <TableHead>Total Quantity</TableHead>
                  <TableHead>Expiring Soon</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicineInventory?.map((item:any) => (
                  <TableRow key={item.medicine_id}>
                    <TableCell className="font-medium">{item.medicine_name}</TableCell>
                    <TableCell>{item.total_quantity}</TableCell>
                    <TableCell>{item.expiring_soon_count}</TableCell>
                    <TableCell>
                      <span 
                        className={`px-2 py-1 rounded-full text-xs ${
                          parseInt(item.total_quantity) < 10 
                            ? 'bg-red-100 text-red-800'
                            : parseInt(item.total_quantity) < 30
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {parseInt(item.total_quantity) < 10 
                          ? 'Low Stock' 
                          : parseInt(item.total_quantity) < 30
                            ? 'Medium Stock'
                            : 'Good Stock'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}