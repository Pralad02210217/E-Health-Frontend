'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogDescription } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { cancelLeaveFn } from '@/lib/api'; // Assuming this is the function that calls the cancel leave mutation
import useAuth from '@/hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';

const CancelLeaveModal = () => {
  const { user, refetch } = useAuth(); // Get user data
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient(); 


  const handleCancelLeave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await cancelLeaveFn(); // Call the cancel leave function
      toast({ title: 'Leave cancelled successfully', variant: 'default' });
      await refetch(); // Refetch user data
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      setIsModalOpen(false); // Close the modal
    } catch (error: any) {
      toast({ title: 'Error cancelling leave', description: error.data.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if there's no user or user is not on leave
  if (!user || !user.is_onLeave) return null;

  return (
    <div>
      {/* Render the Cancel Leave Button */}
      <Button onClick={() => setIsModalOpen(true)} variant="destructive" className='bg-red-300 text-red-700'>
        Cancel Leave
      </Button>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-lg font-semibold">Cancel Leave</h2>
          </DialogHeader>
          <DialogDescription>
            Are you sure you want to cancel this leave that starts at {user.start_date} and ends at {user.end_date}?
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)} variant="outline">Cancel</Button>
            <Button
              onClick={handleCancelLeave}
              className="ml-2"
              disabled={isLoading}
            >
              {isLoading ? 'Cancelling...' : 'Confirm Cancel'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CancelLeaveModal;
