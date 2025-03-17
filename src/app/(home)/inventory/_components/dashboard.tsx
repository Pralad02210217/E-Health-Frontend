'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, AlertTriangle, Package, Stethoscope, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { categoryCountFn, createFeedFn, expiredMedicineFn, updateCategoryFn, deleteCategoryFn } from '@/lib/api';

import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddCategoryModal from './addCateogry';
import EditCategoryModal from './EditCategoryModal';
import DeleteCategoryModal from './DeleteCategoryModal';


export default function InventoryPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const { data: categoriesData } = useQuery({
        queryKey: ['category-counts'],
        queryFn: categoryCountFn,
    });

    const { data: expiredData } = useQuery({
        queryKey: ['expiredMedicines'],
        queryFn: expiredMedicineFn,
    });

    const totalMedicines = categoriesData?.data?.categoriesCount.reduce((sum:any, item:any) => sum + parseInt(item.total.toString()), 0) || 0;
    const totalExpired = expiredData?.data?.medicines.totalExpiredBatches || 0;

    return (
        <div className="p-6 space-y-6 bg-white">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Inventory</h2>
                <AddCategoryModal />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <Card className="border-blue-400">
                    <CardContent className="p-4 text-center">
                        <Package className="text-blue-500 mx-auto" size={30} />
                        <h3 className="text-xl font-bold">{totalMedicines}</h3>
                        <p className="text-gray-600">Total Medicines</p>
                        <Button variant="link" onClick={() => router.push('/inventory/medicines')}>View Full List &raquo;</Button>
                    </CardContent>
                </Card>
                {categoriesData?.data?.categoriesCount?.map((item:any) => (
                    <Card key={item.id} className="border-green-400 relative">
                        <CardContent className="p-4 text-center">
                            <Stethoscope className="text-green-500 mx-auto" size={30} />
                            <h3 className="text-xl font-bold">{item.total}</h3>
                            <h3 className="text-xl font-bold">{item.category}</h3>
                            <Button variant="link" onClick={() => router.push('/inventory/medicines')}>View {item.name}</Button>
                        </CardContent>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="absolute top-2 right-2 p-1">
                                    <MoreVertical size={20} />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setSelectedCategory(item); setEditModalOpen(true); }}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className='"text-red-500' onClick={() => { setSelectedCategory(item); setDeleteModalOpen(true); }}>
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </Card>
                ))}
                <Card className="border-red-400">
                    <CardContent className="p-4 text-center">
                        <AlertTriangle className="text-red-500 mx-auto" size={30} />
                        <h3 className="text-xl font-bold">{totalExpired}</h3>
                        <p className="text-gray-600">Expired Medicines</p>
                        <Button variant="link" onClick={() => router.push('/inventory/expired')}>Resolve Now &raquo;</Button>
                    </CardContent>
                </Card>
            </div>
            {editModalOpen && selectedCategory && (
                <EditCategoryModal
                    category={selectedCategory}
                    onClose={() => setEditModalOpen(false)}
                />
            )}
            {deleteModalOpen && selectedCategory && (
                <DeleteCategoryModal
                    category={selectedCategory}
                    onClose={() => setDeleteModalOpen(false)}
                />
            )}
        </div>
    );
}