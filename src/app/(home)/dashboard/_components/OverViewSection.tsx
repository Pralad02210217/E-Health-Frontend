'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DownloadableChart from './DownloadableComponent';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function OverviewSection({ summaryStats, severityData, doctorWorkload, inventoryData, demographicsData, userByGender }: any) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Treatment Severity Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Treatment Severity</CardTitle>
                    <CardDescription>Distribution of treatment severity levels</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <DownloadableChart filename="treatment_severity_pie_chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={severityData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {severityData.map((entry: any, index: any) => (
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

            {/* Doctor Workload Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Doctor Workload</CardTitle>
                    <CardDescription>Number of treatments by doctor</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <DownloadableChart filename="doctor_workload_bar_chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={doctorWorkload}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="doctor_name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </DownloadableChart>
                    </div>
                </CardContent>
            </Card>

            {/* Top Medicines in Inventory Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Medicines in Inventory</CardTitle>
                    <CardDescription>Current stock levels</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <DownloadableChart filename="top_medicines_inventory_bar_chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart layout="vertical" data={inventoryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis type="number" />
                                    <YAxis dataKey="name" type="category" width={100} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="quantity" fill="#82ca9d" name="Quantity" />
                                    <Bar dataKey="expiring" fill="#ff8042" name="Expiring Soon" />
                                </BarChart>
                            </ResponsiveContainer>
                        </DownloadableChart>
                    </div>
                </CardContent>
            </Card>

            {/* Patient Demographics Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Patient Demographics</CardTitle>
                    <CardDescription>Distribution by user type</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <DownloadableChart filename="patient_demographics_pie_chart">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={demographicsData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                    >
                                        {demographicsData.map((entry: any, index: any) => (
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

            {/* User Gender Distribution Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>User Gender Distribution</CardTitle>
                    <CardDescription>Distribution of users by gender</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64">
                        <DownloadableChart filename="user_gender_distribution_pie_chart">
                            <ResponsiveContainer width="100%" height="100%">
                                 <PieChart>
                                    <Pie
                                        data={userByGender}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={true}
                                        label={({ gender, percent }) => `${gender}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="count"
                                        nameKey="gender"
                                    >
                                        {userByGender.map((entry: any, index: any) => (
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
        </div>
    );
}
