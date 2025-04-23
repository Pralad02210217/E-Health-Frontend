'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DownloadableChart from './DownloadableComponent';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];
const AGE_GROUP_LABELS: { [key: string]: string } = {
  '0': '0-17 Years',
  '1': '18-25 Years',
  '2': '26-35 Years',
  '3': '36-50 Years',
  '4': '51+ Years'
};

export default function PatientsSection({ ageGroupsData, genderData, studentProgramStats, familyMemberTreatments }: any) {
  // Transform age group data with human-readable labels
 const transformedAgeData = ageGroupsData?.map((item: any) => ({
    name: item.age_group,  // Use actual age_group value from API
    count: item.count
  })) || [];
console.log(genderData)
  return (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
        <CardHeader>
          <CardTitle>Age Distribution</CardTitle>
          <CardDescription>Patients by age group</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <DownloadableChart filename="age_distribution_pie_chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={transformedAgeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {transformedAgeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            </DownloadableChart>
          </div>
        </CardContent>
        </Card>
    
        <Card>
        <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Patients by gender</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-64">
            <DownloadableChart filename="gender_distribution_bar_chart">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={genderData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="gender"
                    tickFormatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()}
                />
                <YAxis />
                <Tooltip 
                    formatter={(value: number) => [value, 'Count']}
                    labelFormatter={(label: string) => `Gender: ${label.charAt(0) + label.slice(1).toLowerCase()}`}
                />
                <Legend 
                    formatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()}
                />
                <Bar 
                    dataKey="count" 
                    fill="#8884d8" 
                    name="Gender Distribution"
                />
                </BarChart>
            </ResponsiveContainer>
            </DownloadableChart>
            </div>
        </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Program Statistics</CardTitle>
            <CardDescription>Treatments by study program</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DownloadableChart filename="student_program_statistics_bar_chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentProgramStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="programme_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
              </DownloadableChart>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Family Member Treatments</CardTitle>
            <CardDescription>Treatments by family relation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <DownloadableChart filename="family_member_treatments_bar_chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={familyMemberTreatments}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="relation" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
              </DownloadableChart>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}