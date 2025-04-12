'use client';
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
// Assuming createIllnessFn expects { name, type, description, category_id }
import { createIllnessFn } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import { useForm, Controller } from 'react-hook-form'; // Import Controller
import { useEffect } from 'react';

// Define the structure for a category object passed via props
interface IllnessCategory {
  id: string;
  name: string;
}

// Define the structure for the form data
interface IllnessFormData {
  name: string;
  type: 'COMMUNICABLE' | 'NON_COMMUNICABLE'; // Use specific types
  description: string;
  category_id: string; // Add the category ID field
}

interface AddIllnessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: IllnessCategory[]; // Use the specific type for categories prop
}

export default function AddIllnessModal({ open, onOpenChange, categories }: AddIllnessModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    control, // Get control from useForm for Controller components
    formState: { errors, isSubmitting },
  } = useForm<IllnessFormData>({ // Use the FormData interface for type safety
    defaultValues: {
      name: '',
      type: 'COMMUNICABLE', // Sensible default
      description: '',
      category_id: '', // Initialize category_id
    },
  });

  const queryClient = useQueryClient();

  // Update mutation function to accept the full form data including category_id
  const createIllnessMutation = useMutation({
    mutationFn: (data: IllnessFormData) => createIllnessFn(data), // Pass the typed data
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['illnesses'] }); // Invalidate the main list query
      onOpenChange(false); // Close modal
      reset({ // Explicitly reset form to default values
        name: '',
        type: 'COMMUNICABLE',
        description: '',
        category_id: '',
      });
      toast({ description: 'Illness added successfully.' });
    },
    onError: (error: any) => {
      // Attempt to get a more specific error message, especially from Axios responses
      const errorMessage = error?.response?.data?.message || error.message || 'Unknown error';
      toast({
        variant: 'destructive',
        description: `Failed to add illness: ${errorMessage}`,
      });
    },
  });

  // Update onSubmit handler to use the correct data type
  const onSubmit = (data: IllnessFormData) => {
    console.log("Submitting data:", data); // Log data before mutation
    createIllnessMutation.mutate(data);
  };

  // Effect to reset form when the modal is closed
  useEffect(() => {
    if (!open) {
      reset({ // Explicitly reset form to default values on close
        name: '',
        type: 'COMMUNICABLE',
        description: '',
        category_id: '',
      });
    }
  }, [open, reset]);

  // Check if categories prop is available and has items
  const hasCategories = Array.isArray(categories) && categories.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Add Illness</DialogTitle>
        </DialogHeader>
        {/* Use react-hook-form's handleSubmit */}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-y-4 gap-x-4 py-4"> {/* Adjusted gap */}

          {/* Name Field */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-1"> {/* Reduced gap-y */}
            <Label htmlFor="name" className="text-right sm:col-span-1 sm:block hidden">
              Name
            </Label>
            <div className="col-span-4 sm:col-span-3">
              <Input
                id="name"
                placeholder="Illness Name"
                {...register('name', { required: 'Name is required' })} // Add required validation
                className={errors.name ? 'border-red-500' : ''} // Highlight error field
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
          </div>

          {/* Type Field - Using Controller */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-1">
            <Label htmlFor="type" className="text-right sm:col-span-1 sm:block hidden">
              Type
            </Label>
            <div className="col-span-4 sm:col-span-3">
              <Controller
                name="type"
                control={control}
                rules={{ required: 'Type is required' }} // Validation for type
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue="COMMUNICABLE" // Default value
                  >
                    <SelectTrigger
                      id="type"
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

          {/* Category Field - NEW DROPDOWN using Controller */}
          <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-4 gap-y-1">
            <Label htmlFor="category_id" className="text-right sm:col-span-1 sm:block hidden">
              Category
            </Label>
            <div className="col-span-4 sm:col-span-3">
              <Controller
                name="category_id"
                control={control}
                rules={{ required: 'Category is required' }} // Validation for category
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!hasCategories} // Disable if no categories are available
                  >
                    <SelectTrigger
                      id="category_id"
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
            <Label htmlFor="description" className="text-right sm:col-span-1 sm:block hidden">
              Description
            </Label>
            <div className="col-span-4 sm:col-span-3">
              <Input
                id="description"
                placeholder="Illness Description (optional)"
                {...register('description')} // Register description field
                className={errors.description ? 'border-red-500' : ''}
              />
               {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button
              className='w-full bg-blue-600 text-white hover:bg-blue-700'
              type="submit"
              // Disable button during submission or if mutation is pending
              disabled={isSubmitting || createIllnessMutation.isPending}
            >
              {/* Show loader when submitting */}
              {(isSubmitting || createIllnessMutation.isPending) && (
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {/* Change button text during submission */}
              {isSubmitting || createIllnessMutation.isPending ? 'Adding...' : 'Add Illness'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}