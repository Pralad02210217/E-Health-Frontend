'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { deleteIllnessCategoryFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface DeleteIllnessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  illnessId: string;
}

export default function DeleteIllnessModal({ open, onOpenChange, illnessId }: DeleteIllnessModalProps) {
  const queryClient = useQueryClient();

  const deleteIllnessMutation = useMutation({
    mutationFn: (id: string) => deleteIllnessCategoryFn(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnessesCategory'] });
      onOpenChange(false);
      toast({ description: 'Illness Category deleted successfully.' });
    },
    onError: (error: any) => {
      toast({ variant: 'destructive', description: `Failed to delete illness Category: ${error?.data?.message || error.message || 'Unknown error'}` });
    },
  });

  const handleDelete = () => {
    deleteIllnessMutation.mutate(illnessId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Confirm Deletion</DialogTitle>
          <DialogDescription>Are you sure you want to delete this illness Category?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            {deleteIllnessMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {deleteIllnessMutation.isPending ? 'Deleting' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}