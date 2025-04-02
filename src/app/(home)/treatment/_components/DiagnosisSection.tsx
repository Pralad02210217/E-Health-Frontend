import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export function DiagnosisSection({ form, illnessArray, formOptions }:{form:any, illnessArray:any, formOptions:any}) {
  const { fields, append, remove } = illnessArray;
  
  return (
    <div className="space-y-4 md:col-span-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Diagnoses</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append("")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Illness
        </Button>
      </div>
      
      {fields.length === 0 && (
        <p className="text-sm text-gray-500">No illnesses added yet</p>
      )}

      {fields.map((field:any, index:any) => (
        <div key={field.id} className="p-4 border rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <FormField
              control={form.control}
              name={`illnessIds.${index}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Illness</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select illness" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formOptions.illnessOptions.map((option:any) => (
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
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <FormField
        control={form.control}
        name="severity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Severity</FormLabel>
            <Select
              value={field.value}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="MILD">Mild</SelectItem>
                <SelectItem value="MODERATE">Moderate</SelectItem>
                <SelectItem value="SEVERE">Severe</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Blood Pressure Field */}
      <FormField
        control={form.control}
        name="blood_pressure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Blood Pressure</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="e.g. 120/80" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      {/* Hospital Forwarding Checkboxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="forward_to_hospital"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Forward to Hospital</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="forwarded_by_hospital"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Forwarded by Hospital</FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="diagnosis"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Diagnosis Notes</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Enter detailed diagnosis" 
                className="min-h-[120px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}