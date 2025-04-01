'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function IllnessesSection({ illnessChartData }: any) {
  return (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card>
                 <CardHeader>
                   <CardTitle>Most Treated Illnesses</CardTitle>
                   <CardDescription>Top illnesses by treatment count</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={illnessChartData}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip />
                         <Legend />
                         <Bar dataKey="count" fill="#0088FE" />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>
   
               <Card>
                 <CardHeader>
                   <CardTitle>Illnesses by Type</CardTitle>
                   <CardDescription>Distribution of illness types</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                         <Pie
                           data={illnessChartData}
                           cx="50%"
                           cy="50%"
                           labelLine={true}
                           label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                           outerRadius={80}
                           fill="#8884d8"
                           dataKey="count"
                         >
                           {illnessChartData.map((entry:any, index:any) => (
                             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                           ))}
                         </Pie>
                         <Tooltip />
                         <Legend />
                       </PieChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>
             </div>
  );
}