import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Medicine {
  id: string;
  name: string;
  batches: {
    id: string;
    batch_name: string;
    quantity: number;
    expiry_date: string;
  }[];
}

interface FormMedicine {
  id: string;
  medicineId: string;
  quantity: number;
  dosage: string;
}

interface MedicineSectionProps {
  form: any; // You can replace 'any' with the actual form type if available
  medicinesArray: any; //  You can replace 'any' with the actual type
  formOptions: {
    medicineOptions: { label: string; value: string }[];
  };
  medicines?: Medicine[]; // Added:  Optional prop for the full medicines data
}

export function MedicineSection({ form, medicinesArray, formOptions, medicines }: MedicineSectionProps) {
  const { fields, append, remove } = medicinesArray;
  const [availableStock, setAvailableStock] = useState<number | null>(null);
  const [selectedMedicineId, setSelectedMedicineId] = useState<string>('');

  // Update available stock when medicineId changes
  useEffect(() => {
    if (fields.length > 0) {
      const currentMedicineId = form.getValues(`medicines.${0}.medicineId`);
        setSelectedMedicineId(currentMedicineId);
      const selectedMedicine = medicines?.find((m) => m.id === currentMedicineId);
      const stock = selectedMedicine
        ? selectedMedicine.batches.reduce((sum, batch) => sum + batch.quantity, 0)
        : null;
      setAvailableStock(stock);
    }
  }, [fields, medicines, form]);


  const handleMedicineChange = (value: string, index: number) => {
    medicinesArray.update(index, { medicineId: value, quantity: 1, dosage: '' }); //reset quantity and dosage
    const selectedMedicine = medicines?.find((m) => m.id === value);
    const stock = selectedMedicine
      ? selectedMedicine.batches.reduce((sum, batch) => sum + batch.quantity, 0)
      : null;
    setAvailableStock(stock);
    setSelectedMedicineId(value);
  };

  const handleQuantityChange = (value: number, index: number) => {
    medicinesArray.update(index, { medicineId: fields[index].medicineId, quantity: value, dosage: fields[index].dosage });
  }

  return (
    <div className="space-y-4 md:col-span-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Prescribed Medicines</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ medicineId: "", quantity: 1, dosage: "" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Medicine
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-sm text-gray-500">No medicines added yet</p>
      )}

      {fields.map((field: FormMedicine, index: number) => (
        <div key={field.id} className="p-4 border rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`medicines.${index}.medicineId`}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>Medicine</FormLabel>
                  <Select
                    value={formField.value}
                    onValueChange={(value) => {
                      formField.onChange(value);
                      handleMedicineChange(value, index); // Call handleMedicineChange
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medicine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formOptions.medicineOptions.map((option: { label: string; value: string }) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`medicines.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      {...field}
                      onChange={(e) => {
                        const quantityValue = parseInt(e.target.value);
                        if (!isNaN(quantityValue) && quantityValue >= 1) {
                          field.onChange(quantityValue);
                          handleQuantityChange(quantityValue, index);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {availableStock !== null && (
                    <p className={cn(
                      "text-sm mt-1",
                      availableStock === 0 ? "text-red-500" : "text-gray-500"
                    )}>
                      Available: {availableStock}
                    </p>
                  )}
                </FormItem>
              )}
            />

            <div className="flex space-x-2">
              <FormField
                control={form.control}
                name={`medicines.${index}.dosage`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g. 1 tablet 3x daily" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="mt-8"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

