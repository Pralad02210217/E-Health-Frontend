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
import { updateMedicinesFn, deleteMedicineFn } from "@/lib/api";

const medicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category_id: z.string().min(1, "Category is required"),
  unit: z.string().min(1, "Unit is required"),
});

export function EditMedicineModal({ medicine, categoriesData }: any) {
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
    defaultValues: {
      name: medicine.name,
      category_id: medicine.category_id,
      unit: medicine.unit,
    },
  });

  const editMutation = useMutation({
    mutationFn: (updatedData: any) => updateMedicinesFn(medicine.id, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      setOpen(false);
    },
  });

  const onSubmit = (data: any) => {
    editMutation.mutate({ ...data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded-md">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Edit Medicine</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
            <Input {...register("name")} placeholder="Medicine Name" className="border p-2 rounded-lg w-full mt-1" />
            {errors.name?.message && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <Select onValueChange={(value) => setValue("category_id", value)} defaultValue={medicine.category_id}>
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
            {errors.category_id?.message && <p className="text-red-500 text-sm mt-1">{errors.category_id.message as string}</p>}
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700">Unit</label>
            <Input {...register("unit")} placeholder="Unit (e.g., ml, mg, tablets)" className="border p-2 rounded-lg w-full mt-1" />
            {errors.unit?.message && <p className="text-red-500 text-sm mt-1">{errors.unit.message as string}</p>}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
            <DatePicker
              selected={watch("expiry_date") || null}
              onChange={(date) => setValue("expiry_date", date || new Date())}
              dateFormat="yyyy-MM-dd"
              className="border p-2 rounded-lg w-full mt-1"
              placeholderText="Expiry Date"
              minDate={new Date()}
            />
            {errors.expiry_date && <p className="text-red-500 text-sm mt-1">{errors.expiry_date.message}</p>}
          </div> */}

          <Button type="submit" disabled={editMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md w-full">
            {editMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteMedicineModal({ medicine }: any) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deleteMedicineFn(medicine.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md">
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">Confirm Deletion</DialogTitle>
        </DialogHeader>

        <p className="text-gray-700">Are you sure you want to delete <span className="font-bold">{medicine.name}</span>?</p>

        <div className="flex justify-end space-x-4 mt-4">
          <Button onClick={() => setOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md">
            Cancel
          </Button>
          <Button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md">
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
