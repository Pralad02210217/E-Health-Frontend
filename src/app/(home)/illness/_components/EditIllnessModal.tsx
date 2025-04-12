'use client';
import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// Assuming updateIllnessFn expects (id, { name, type, description, category_id })
import { updateIllnessFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import { useForm, Controller } from 'react-hook-form'; // Import Controller

// --- Interfaces (ensure these match definitions in other files if shared) ---
interface IllnessCategory {
  id: string;
  name: string;
}

interface Illness {
  id: string;
  name: string;
  type: 'COMMUNICABLE' | 'NON_COMMUNICABLE';
  description: string;
  category_id: string;
  // Add any other fields your illness object has
}

interface IllnessFormData {
  name: string;
  type: 'COMMUNICABLE' | 'NON_COMMUNICABLE';
  description: string;
  category_id: string;
}
// --- End Interfaces ---

interface EditIllnessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  illness: Illness | null; // Use the specific Illness type, allow null
  categories: IllnessCategory[]; // Use the specific Category type
}

export default function EditIllnessModal({ open, onOpenChange, illness, categories }: EditIllnessModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control, // Get control for Controller components
    formState: { errors, isSubmitting },
  } = useForm<IllnessFormData>({
    // Default values are less critical here as useEffect resets based on the illness prop
    defaultValues: {
      name: '',
      type: 'COMMUNICABLE',
      description: '',
      category_id: '',
    },
  });

  const queryClient = useQueryClient();

  // Effect to reset the form when the modal opens with new illness data or closes
  useEffect(() => {
    if (open && illness) {
      // If modal is open and illness data is available, populate the form
      reset({
        name: illness.name || '',
        type: illness.type || 'COMMUNICABLE', // Fallback default type
        description: illness.description || '',
        category_id: illness.category_id || '', // Populate category_id
      });
    } else if (!open) {
      // If modal is closing, reset to blank defaults
       reset({
          name: '',
          type: 'COMMUNICABLE',
          description: '',
          category_id: '',
       });
    }
  }, [open, illness, reset]); // Dependencies: open state, illness object, reset function


  // Update mutation function
  const updateIllnessMutation = useMutation({
    mutationFn: (variables: { id: string; data: IllnessFormData }) => // Use IllnessFormData
      updateIllnessFn(variables.id, variables.data), // Pass ID and full data object
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnesses'] }); // Invalidate cache
      onOpenChange(false); // Close modal
      // No need to reset here, useEffect handles it on close
      toast({ description: 'Illness updated successfully.' });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error.message || 'Unknown error';
      toast({
        variant: 'destructive',
        description: `Failed to update illness: ${errorMessage}`,
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: IllnessFormData) => { // Use IllnessFormData type
    if (!illness?.id) {
      // Should not happen if modal opens correctly, but good practice check
      toast({ variant: 'destructive', description: 'Error: Cannot update illness without an ID.' });
      return;
    }
    console.log("Updating with data:", data); // Log data before mutation
    updateIllnessMutation.mutate({ id: illness.id, data });
  };

  // Check if categories prop is available and has items
  const hasCategories = Array.isArray(categories) && categories.length > 0;

  return (
    // Ensure illness is loaded before rendering the Dialog content, or handle null case
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit Illness</DialogTitle>
        </DialogHeader>
        {illness ? ( // Only render form if illness data is available
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4 gap-x-4 py-4">

            {/* Name Field */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-1">
              <Label htmlFor="edit-name" className="text-right sm:col-span-1 sm:block hidden"> {/* Unique ID */}
                Name
              </Label>
              <div className="col-span-4 sm:col-span-3">
                <Input
                  id="edit-name" // Unique ID
                  placeholder="Illness Name"
                  {...register('name', { required: 'Name is required' })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
            </div>

            {/* Type Field - Using Controller */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-1">
              <Label htmlFor="edit-type" className="text-right sm:col-span-1 sm:block hidden"> {/* Unique ID */}
                Type
              </Label>
              <div className="col-span-4 sm:col-span-3">
                <Controller
                  name="type"
                  control={control}
                  rules={{ required: 'Type is required' }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Value is controlled by Controller
                    >
                      <SelectTrigger
                        id="edit-type" // Unique ID
                        className={errors.type ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMMUNICABLE">COMMUNICABLE</SelectItem>
                        <SelectItem value="NON_COMMUNICABLE">NON_COMMUNICABLE</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
              </div>
            </div>

            {/* Category Field - Using Controller */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-1">
              <Label htmlFor="edit-category_id" className="text-right sm:col-span-1 sm:block hidden"> {/* Unique ID */}
                Category
              </Label>
              <div className="col-span-4 sm:col-span-3">
                <Controller
                  name="category_id"
                  control={control}
                  rules={{ required: 'Category is required' }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value} // Value is controlled by Controller
                      disabled={!hasCategories}
                    >
                      <SelectTrigger
                        id="edit-category_id" // Unique ID
                        className={errors.category_id ? 'border-red-500' : ''}
                      >
                        <SelectValue placeholder={hasCategories ? "Select category" : "No categories available"} />
                      </SelectTrigger>
                      <SelectContent>
                         {!hasCategories && (
                            <SelectItem value="-" disabled>
                              No categories loaded
                            </SelectItem>
                          )}
                        {/* Map over the categories passed via props */}
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id.message}</p>}
              </div>
            </div>

            {/* Description Field */}
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-1">
              <Label htmlFor="edit-description" className="text-right sm:col-span-1 sm:block hidden"> {/* Unique ID */}
                Description
              </Label>
              <div className="col-span-4 sm:col-span-3">
                <Input
                  id="edit-description" // Unique ID
                  placeholder="Illness Description (optional)"
                  {...register('description')}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
              </div>
            </div>

            <DialogFooter>
              <Button
                className='w-full bg-blue-600 text-white hover:bg-blue-700'
                type="submit"
                disabled={isSubmitting || updateIllnessMutation.isPending}
              >
                {(isSubmitting || updateIllnessMutation.isPending) && (
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting || updateIllnessMutation.isPending ? 'Updating...' : 'Update Illness'}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          // Optional: Show a loading or error state if illness is null when expected
          <div className="p-4 text-center text-gray-500">Loading illness data...</div>
        )}
      </DialogContent>
    </Dialog>
  );
}