"use client";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { updateCategoryFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

interface Category {
    id: string;
    category: string;
    total: number;
}
interface EditCategoryModalProps {
    category: Category;
    onClose: () => void;
}

export default function EditCategoryModal({ category, onClose }: EditCategoryModalProps) {
  const [name, setName] = useState(category.category);
  const [open, setOpen] = useState(true);
  const queryClient = useQueryClient();

  const { mutate: updateCategory, isPending } = useMutation({
    mutationFn: () => updateCategoryFn(category.id, { name }),
    onSuccess: () => {
      toast({ title: "Category updated successfully." });
      queryClient.invalidateQueries({ queryKey: ["category-counts"] });
      onClose();
    },
    onError: () => {
      toast({ title: "Failed to update category.", variant: "destructive" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter new category name" />
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={() => updateCategory()} disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
