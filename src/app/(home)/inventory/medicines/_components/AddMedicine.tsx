import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addMedicinesFn } from "@/lib/api";

const medicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
});

export default function AddMedicineModal({ categoriesData }: any) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(medicineSchema),
    defaultValues: { name: "", category_id: "",  unit: "" },
  });

  const addMutation = useMutation({
    mutationFn: addMedicinesFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      setOpen(false);
    },
  });

  const onSubmit = (data: any) => {
    addMutation.mutate({ ...data });
  };

  return (
   <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md">
        Add Medicine
        </Button>
    </DialogTrigger>
    <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl">
        <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-gray-800">Add New Medicine</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Medicine Name */}
        <div>
            <label htmlFor="medicineName" className="block text-sm font-medium text-gray-700">Medicine Name</label>
            <Input {...register("name")} id="medicineName" placeholder="Medicine Name" className="border p-2 rounded-lg w-full mt-1" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Category Selection */}
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <Select onValueChange={(value) => setValue("category_id", value)}>
            <SelectTrigger className="border p-2 rounded-lg w-full mt-1">
                <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
                {categoriesData?.data.categories.map((category: any) => (
                <SelectItem key={category.id} value={category.id}>
                    {category.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
            {errors.category_id && <p className="text-red-500 text-sm mt-1">{errors.category_id.message}</p>}
        </div>




        {/* Unit */}
        <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
            <Input {...register("unit")} id="unit" placeholder="Unit (e.g., ml, mg, tablets)" className="border p-2 rounded-lg w-full mt-1" />
            {errors.unit && <p className="text-red-500 text-sm mt-1">{errors.unit.message}</p>}
        </div>



        {/* Submit Button */}
        <Button
            type="submit"
            disabled={addMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md w-full"
        >
            {addMutation.isPending ? "Adding..." : "Add Medicine"}
        </Button>
        </form>
    </DialogContent>
    </Dialog>
  );
}
