'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactionFn } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { CalendarIcon, UserIcon } from 'lucide-react';
import AddStockModal from './AddStock';
import RemoveStockModal from './RemoveStock';

export default function StockPage() {
  const { data: transactionsData, isLoading, isError, error } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactionFn,
  });

  const [filterType, setFilterType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Adjust as needed

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const transactions = transactionsData?.data.transactions || [];

  const filteredTransactions = transactions.filter((transaction: any) => {
    const typeMatch = !filterType || transaction.type === filterType;
    const searchMatch =
      transaction.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return typeMatch && searchMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  console.log(transactions)

  return (
    <Card className="p-4">
      <CardHeader>
        <CardTitle>Stock Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="flex gap-2">
            <Button
              variant={filterType === null ? 'default' : 'outline'}
              className={filterType === null ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-100'}
              onClick={() => setFilterType(null)}
            >
              All
            </Button>
            <Button
              variant={filterType === 'ADDED' ? 'default' : 'outline'}
              className={filterType === 'ADDED' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-100'}
              onClick={() => setFilterType('ADDED')}
            >
              Added
            </Button>
            <Button
              variant={filterType === 'REMOVED' ? 'default' : 'outline'}
              className={filterType === 'REMOVED' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-blue-600 hover:bg-blue-100'}
              onClick={() => setFilterType('REMOVED')}
            >
              Removed
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <AddStockModal />
            <RemoveStockModal />
          </div>
        </div>
        <div className="overflow-x-auto mt-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Medicine Name</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Change</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Patient</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody> 
              {currentItems.map((transaction: any) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.medicine_name}</TableCell>
                  <TableCell>{transaction.batch_name}</TableCell>
                  <TableCell>{transaction.change}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {transaction.type === 'ADDED' ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              {transaction.type}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              {transaction.type}
                            </Badge>
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Transaction Type: {transaction.type}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{transaction.reason}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {transaction.patient_id ? (
                            <UserIcon className="w-4 h-4 text-blue-500" />
                          ) : (
                            'No'
                          )}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Patient Involved: {transaction.patient_id ? 'Yes' : 'No'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="flex items-center gap-1">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4 text-gray-400" />
                            {format(new Date(transaction.created_at), 'MMM dd, HH:mm')}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm:ss')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            className="mr-2"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            className="ml-2"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}