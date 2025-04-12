'use client';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchIllnessFn, fetchIllnessCategoryFn } from '@/lib/api';
import AddIllnessModal from './AddIllnessModal';
import EditIllnessModal from './EditIllnessModal';
import DeleteIllnessModal from './DeleteIllnessModal';
import { Loader2 } from 'lucide-react';

// Define interfaces for better type safety
interface IllnessCategory {
  id: string;
  name: string;
}

interface FetchCategoriesResponse {
  message: string;
  data: {
    categories: IllnessCategory[];
  }
}

interface Illness {
  id: string;
  name: string;
  type: 'COMMUNICABLE' | 'NON_COMMUNICABLE';
  description: string;
  category_id: string;
}

interface FetchIllnessResponse {
  message: string;
  data: {
    illnesses: Illness[];
  }
}

export default function IllnessPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch Illnesses - Fix type definition with proper transformation
  const {
    data: illnessResponse,
    isLoading: isLoadingIllnesses,
    isError: isErrorIllnesses,
    error: illnessError,
  } = useQuery<FetchIllnessResponse>({
    queryKey: ['illnesses'],
    queryFn: fetchIllnessFn as any,
  });


  // Fetch Illness Categories - Fix type definition with proper transformation
  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: categoryError,
  } = useQuery<FetchCategoriesResponse>({
    queryKey: ['illnessCategories'],
    queryFn: fetchIllnessCategoryFn as any,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedIllness, setSelectedIllness] = useState<Illness | null>(null);

  // Memoize category lookup map for efficiency
  const categoriesMap = useMemo(() => {
    const map = new Map<string, string>();
    if (categoriesData?.data?.categories) {
      categoriesData.data.categories.forEach((cat) => map.set(cat.id, cat.name));
    }
    return map;
  }, [categoriesData]);

  const handleEditClick = (illness: Illness) => {
    setSelectedIllness(illness);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (illness: Illness) => {
    setSelectedIllness(illness);
    setIsDeleteModalOpen(true);
  };

  // Extract illnesses, handle potential undefined data structure
  const illnesses = illnessResponse?.data.illnesses || [];


  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIllnesses = illnesses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(illnesses.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    // Clamp page number between 1 and totalPages
    const newPage = Math.max(1, Math.min(pageNumber, totalPages || 1));
    setCurrentPage(newPage);
  };

  // Loading state
  if (isLoadingIllnesses || isLoadingCategories) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Loading data...</span>
      </div>
    );
  }

  // Combined error state (can be more granular if needed)
  if (isErrorIllnesses || isErrorCategories) {
    console.error("Illness Fetch Error:", illnessError);
    console.error("Category Fetch Error:", categoryError);
    return (
      <Card className="p-4 m-4 border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <p>There was a problem fetching the necessary data.</p>
          {isErrorIllnesses && <p className="mt-2 text-sm text-red-500">Could not load illnesses: {illnessError?.message || 'Unknown error'}</p>}
          {isErrorCategories && <p className="mt-2 text-sm text-red-500">Could not load categories: {categoryError?.message || 'Unknown error'}</p>}
          <p className="mt-4">Please try refreshing the page or contact support if the problem persists.</p>
        </CardContent>
      </Card>
    );
  }

  const categoryList = categoriesData?.data?.categories || [];

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Manage Diseases</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setIsAddModalOpen(true)}
            disabled={isErrorCategories || (categoryList.length === 0 && !isLoadingCategories)}
            title={isErrorCategories || (categoryList.length === 0 && !isLoadingCategories) ? "Cannot add illness without categories" : "Add a new illness"}
          >
            Add Illness
          </Button>
        </div>
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentIllnesses.length > 0 ? (
                currentIllnesses.map((illness) => {
                  // Lookup category name
                  const categoryName = categoriesMap.get(illness.category_id) || <span className="text-gray-500 italic">N/A</span>;

                  return (
                    <TableRow key={illness.id}>
                      <TableCell className="font-medium">{illness.name}</TableCell>
                      <TableCell>{illness.type}</TableCell>
                      <TableCell>{categoryName}</TableCell>
                      <TableCell className="max-w-xs truncate" title={illness.description}>
                        {illness.description || '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(illness)}
                            disabled={isErrorCategories}
                            title={isErrorCategories ? "Cannot edit illness without categories" : "Edit illness"}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(illness)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                    No illnesses found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              variant="outline"
              size="sm"
            >
              Next
            </Button>
          </div>
        )}

        {/* Modals - Pass categories down */}
        <AddIllnessModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          categories={categoryList}
        />
        {selectedIllness && (
          <EditIllnessModal
            open={isEditModalOpen}
            onOpenChange={setIsEditModalOpen}
            illness={selectedIllness}
            categories={categoryList}
          />
        )}
        {selectedIllness && (
          <DeleteIllnessModal
            open={isDeleteModalOpen}
            onOpenChange={setIsDeleteModalOpen}
            illnessId={selectedIllness?.id}
          />
        )}
      </CardContent>
    </Card>
  );
}