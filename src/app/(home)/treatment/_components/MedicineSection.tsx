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

export function MedicineSection({ form, medicinesArray, formOptions }:{form:any, medicinesArray:any, formOptions:any}) {
  const { fields, append, remove } = medicinesArray;
  
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
      
      {fields.map((field:any, index:any) => (
        <div key={field.id} className="p-4 border rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name={`medicines.${index}.medicineId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medicine</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medicine" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formOptions.medicineOptions.map((option:any) => (
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
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
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