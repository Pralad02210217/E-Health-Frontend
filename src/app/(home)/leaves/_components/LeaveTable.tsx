import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { fetchLeavesFn } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

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
  if (isNaN(date.getTime())) return "Invalid Date"; // Handle incorrect formats

  // Format to dd/mm/yyyy
  return date.toLocaleDateString("en-GB"); // en-GB format is dd/mm/yyyy
};



const LeaveTable = () => {
  const { data: leaves, isLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: fetchLeavesFn,
    staleTime: 1000 * 60 * 5,
    select: (response) => response.data.leaveDetails, 
  });

  console.log("Leaves data:", leaves); // Debugging

  return isLoading ? (
    <Loader className="animate-spin mx-auto" size={32} />
  ) : (
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
        {Array.isArray(leaves) && leaves.length > 0 ? (
          leaves.map((leave) => (
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
  );
};

export default LeaveTable;
