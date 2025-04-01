'use client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MedicationsSection({ medicineChartData, medicineInventory, medicineUsageOverTime }: any) {
  return (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Card>
                 <CardHeader>
                   <CardTitle>Most Prescribed Medicines</CardTitle>
                   <CardDescription>Top medicines by prescription count</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={medicineChartData.slice(0, 5)}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis dataKey="name" />
                         <YAxis />
                         <Tooltip />
                         <Legend />
                         <Bar dataKey="count" fill="#00C49F" />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>
   
               <Card>
                 <CardHeader>
                   <CardTitle>Medicine Inventory Status</CardTitle>
                   <CardDescription>Current inventory levels</CardDescription>
                 </CardHeader>
                 <CardContent>
                   <div className="h-64">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart layout="vertical" data={medicineInventory.slice(0, 5)}>
                         <CartesianGrid strokeDasharray="3 3" />
                         <XAxis type="number" />
                         <YAxis dataKey="medicine_name" type="category" width={100} />
                         <Tooltip />
                         <Bar dataKey="total_quantity" fill="#FFBB28" name="Total Quantity" />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                 </CardContent>
               </Card>
   
               <Card className="md:col-span-2">
                 <CardHeader>
                   <CardTitle>Medicine Usage Over Time</CardTitle>
                   <CardDescription>Consumption patterns by month</CardDescription>
                 </CardHeader>
                 <CardContent>
               <div className="h-64">
               <ResponsiveContainer width="100%" height="100%">
                   <BarChart 
                   data={medicineUsageOverTime.map((item:any) => ({
                       ...item,
                       total_used: Math.abs(parseInt(item.total_used))
                   }))}
                   >
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="medicine_name" />
                   <YAxis />
                   <Tooltip />
                   <Legend />
                   <Bar dataKey="total_used" fill="#FF8042" name="Total Used" />
                   </BarChart>
               </ResponsiveContainer>
               </div>
                 </CardContent>
               </Card>
             </div>
  );
}