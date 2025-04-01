import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { fetchLeavesFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useState } from "react";

type Leave = {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  created_at: string;
  processed: boolean;
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  return date.toLocaleDateString("en-GB");
};

const LeaveTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // You can adjust this

  const { data: leaves, isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: fetchLeavesFn,
    staleTime: 1000 * 60 * 5,
    select: (response) => response.data.leaveDetails,
  });

  if (isLoading) {
    return <Loader className="animate-spin mx-auto" size={32} />;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaves?.slice(indexOfFirstItem, indexOfLastItem) || [];

  const totalPages = leaves ? Math.ceil(leaves.length / itemsPerPage) : 0;

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Processed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentItems.length > 0 ? (
            currentItems.map((leave: any) => (
              <TableRow key={leave.id}>
                <TableCell>{formatDate(leave.start_date)}</TableCell>
                <TableCell>{formatDate(leave.end_date)}</TableCell>
                <TableCell>{leave.reason}</TableCell>
                <TableCell>{formatDate(leave.created_at)}</TableCell>
                <TableCell>{leave.processed ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-3 py-1 rounded ${currentPage === pageNumber ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {pageNumber}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveTable;