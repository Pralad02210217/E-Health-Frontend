'use client';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { addCategoryFn } from '@/lib/api'; // Correct import
import { toast } from '@/hooks/use-toast';
import { Loader, PlusCircle } from 'lucide-react';

interface CreateFeed {
    name: string;
}

export default function AddCategoryModal() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const queryClient = useQueryClient();

    const { mutate: addCategoryMutation, isPending } = useMutation({
        mutationFn: addCategoryFn, // Correct mutationFn
        onSuccess: () => {
            toast({ description: "Successfully added a new category." });
            queryClient.invalidateQueries({ queryKey: ['category-counts'] });
            setOpen(false);
            setName("");
        },
        onError: (error) => { // Correct onError parameter
            console.error("Error adding category:", error); // Log the error
            toast({ variant: "destructive", description: "Failed to add category." });
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'>
                    <PlusCircle className="mr-2 h-5 w-5 " /> Add New Item
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Category Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Button className='"bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600' onClick={() => addCategoryMutation({ name })} disabled={!name || isPending}>
                    {isPending && <Loader className="animate-spin" />}
                    {isPending ? "Adding..." : "Save"}
                </Button>
            </DialogContent>
        </Dialog>
    );
}