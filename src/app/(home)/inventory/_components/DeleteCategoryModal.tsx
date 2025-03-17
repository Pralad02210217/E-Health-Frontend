"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { deleteCategoryFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface Category {
    id: string;
    category: string;
    total: number;
}

interface DeleteCategoryModalProps {
    category: Category;
    onClose: () => void;
}

export default function DeleteCategoryModal({ category, onClose }: DeleteCategoryModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(true);
  console.log(category)

  const { mutate: deleteCategory, isPending } = useMutation({
    mutationFn: () => deleteCategoryFn(category.id),
    onSuccess: () => {
      toast({ title: "Category deleted successfully." });
      queryClient.invalidateQueries({ queryKey: ["category-counts"] });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to delete category.", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
        </DialogHeader>
        <p className="text-gray-600">Are you sure you want to delete this category? This action cannot be undone.</p>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" onClick={() => deleteCategory()} disabled={isPending}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
