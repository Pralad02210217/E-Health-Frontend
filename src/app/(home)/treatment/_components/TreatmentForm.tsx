'use client'
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createTreatmentFn, fetchIllnessFn, fetchMedicinesFn, getUsersFn, useTransactionFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Search, Plus, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import useAuth from "@/hooks/use-auth";
import { Treatmentschema } from "@/lib/validations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FamilyRegistrationForm } from "./FamilyRegisterForm";
import { SignUpDialog } from "./RegisterDialog";



export default function TreatmentForm() {

  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState<any>(null);
  const [isRegisterFamilyMemberOpen, setIsRegisterFamilyMemberOpen] = useState(false);
  const [needRegistration, setNeedRegistration] = useState(false)

  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(Treatmentschema),
    defaultValues: {
      userType: "Student",
      contactNumber: "",
      studentNumber: "",
      patientName: "",
      gender: "",
      illnessIds: [""],
      diagnosis: "",
      severity: "MILD",
      patientId:"",
      medicines: [{ medicineId: "", quantity: 1, dosage: "" }],
      staffId: "",
      familyMemberId: ""
    }
  });
  
// Define your form type explicitly from the schema
  type FormValues = z.infer<typeof Treatmentschema>;

  // For medicines array
  const medicinesArray = useFieldArray<FormValues>({
    control: form.control,
    name: "medicines"
  });

// For illnesses array - with more explicit typing
  const illnessArray = useFieldArray({
    control: form.control,
    name: "illnessIds" as any
  });

  // Then use these destructured variables
  const { fields, append, remove } = medicinesArray;
  const { fields: illnessFields, append: appendIllness, remove: removeIllness } = illnessArray;

    const userType = form.watch("userType");
    const contactNumber = form.watch("contactNumber");

    // Data fetching
    const { data: users, isLoading: usersLoading } = useQuery({ 
      queryKey: ["users"], 
      queryFn: getUsersFn 
    });
    
  const { data: medicines, isLoading: medicinesLoading } = useQuery({ 
    queryKey: ["medicines"], 
    queryFn: fetchMedicinesFn 
  });
  
  const { data: illnesses, isLoading: illnessesLoading } = useQuery({ 
    queryKey: ["illnesses"], 
    queryFn: fetchIllnessFn 
  });
  const {user} = useAuth()

  // Mutations
  const treatmentMutation = useMutation({
    mutationFn: createTreatmentFn,
    onSuccess: () => toast({ 
      title: "Success",
      description: "Treatment recorded successfully" 
    }),
    onError: (error: any) => toast({ 
      title: "Error",
      description: error.data.message || "Failed to record treatment", 
      variant: "destructive" 
    })
  });

  const transactionMutation = useMutation({ 
    mutationFn: useTransactionFn 
  });

  // Add this near your other useState hooks
  const [isLookupLoading, setIsLookupLoading] = useState(false);

// Then modify your handlePatientLookup function
  const handlePatientLookup = () => {
    if (contactNumber.length < 8) {
      toast({
        title: "Invalid Contact",
        description: "Contact number must be at least 8 digits",
        variant: "destructive"
      });
      return;
    }
    
    setIsLookupLoading(true);
    
    // Simulate network delay (you can remove setTimeout if your lookup is already async)
    setTimeout(() => {
      const patient = users?.data?.users?.find(
        (u: { contact_number: string; name: string; gender?: string; student_id?: string; id?: string }) => 
          u.contact_number === contactNumber
      );
      
      if (patient) {
        form.setValue("patientName", patient.name);
        form.setValue("gender", patient.gender || '');
        if (patient.student_id && userType === "Student") {
          form.setValue("studentNumber", patient.student_id);
        }
        form.setValue("patientId", patient.id || '');
        toast({
          title: "Patient Found",
          description: `Patient ${patient.name} found in the system.`
        });
      } else {
        setNeedRegistration(true)
        toast({
          title: "Patient Not Found",
          description: "No patient found with this contact number.",
          variant: "destructive"
        });
      }
      
      setIsLookupLoading(false);
    }, 500); // Simulating a network delay of 500ms
  };

  const onSubmit = async (data: z.infer<typeof Treatmentschema>) => {

    if (user.userType != 'HA'){
      return toast({
        title: "Error",
        description: "Unauthorized",
        variant: "destructive"
      })
    }
      // Step 1: Check stock availability
    const insufficientStockMedicines = data.medicines.filter((prescribedMedicine) => {
    // Find the medicine in the available medicines list
    const medicineDetails = medicines?.data?.medicines?.find(
      (m: { id: string; stock: number }) => m.id === prescribedMedicine.medicineId
    );

    // If medicine not found or stock is insufficient, return true
    return !medicineDetails || medicineDetails.stock < prescribedMedicine.quantity;
  });

  // If any medicines have insufficient stock, prevent submission
  if (insufficientStockMedicines.length > 0) {
    // Create a more detailed error message
    const errorMessage = insufficientStockMedicines.map((medicine) => {
      const medicineDetails = medicines?.data?.medicines?.find(
        (m: { id: string; name: string; stock: number }) => m.id === medicine.medicineId
      );
      
      return `${medicineDetails?.name || 'Unknown Medicine'}: Requested ${medicine.quantity}, Available ${medicineDetails?.stock || 0}`;
    }).join(", ");

    return toast({
      title: "Insufficient Stock",
      description: `Cannot proceed. Insufficient stock for: ${errorMessage}`,
      variant: "destructive",
    });
  }

   try {
        const isStaffFamily = selectedStaff;

        // Determine patient or family member ID
        const patientId = isStaffFamily ? null : form.getValues("patientId")!;
        const familyMemberId = isStaffFamily ? form.getValues("patientId")! : null;

        // 🟢 Create treatment record
        const treatment = await treatmentMutation.mutateAsync({
          patient_id: patientId!,
          family_member_id: familyMemberId!,
          doctor_id: user.userId, // Logged-in HA user
          illness_ids: data.illnessIds,
          severity: data.severity,
          notes: data.diagnosis,
          medicines: data.medicines.map(m => ({ 
            medicine_id: m.medicineId, 
            dosage: m.dosage 
          }))
        });

        // 🟢 Update medicine stock for each prescribed medicine
        await Promise.all(
          data.medicines.map(m => transactionMutation.mutateAsync({
            medicine_id: m.medicineId,
            quantity: m.quantity,
            reason: "Prescription",
            patient_id: patientId!,
            family_member_id: familyMemberId!
          }))
        );

        toast({ 
          title: "Success",
          description: "Treatment recorded and stock updated successfully" 
        });

        queryClient.invalidateQueries({ queryKey: ['treatments'] });

        // 🟢 Reset form
        form.reset();
      } catch (error: any) {
        toast({ 
          title: "Error",
          description: error.data.message || "Treatment recording failed", 
          variant: "destructive" 
        });
      }
    }

  const isLoading = usersLoading || medicinesLoading || illnessesLoading;
  const isMutating = treatmentMutation.isPending || transactionMutation.isPending;

  // Format select options
  const illnessOptions = illnesses?.data.illnesses?.map((i: { name: any; id: any; }) => ({
    label: i.name,
    value: String(i.id)
  })) || [];

  const medicineOptions = medicines?.data?.medicines?.map((m: { name: any; id: any; }) => ({
    label: m.name,
    value: m.id
  })) || [];

    const staffOptions = users?.data?.users
    ?.filter((u: any) => u.userType === 'STAFF')
    .map((staff: any) => ({
      label: staff.name,
      value: staff.id,
    })) || [];

  const familyMemberOptions = selectedStaff?.family_members?.map((member: any) => ({
    label: member.name,
    value: member.id,
  })) || [];


  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>New Treatment Record</CardTitle>
        <CardDescription>
          Record patient treatment details and prescribe medicines
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2">Loading data...</span>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Patient Information Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="text-lg font-medium">Patient Information</h3>
                  {userType === 'StaffFamilyMember' &&  selectedStaff &&(
                  <FamilyRegistrationForm staffId={selectedStaff.id} onSuccess={() => {
                                    //refresh the data
                    }}/>
                  )}
                  {(userType === "Non-Student" || (userType === "Student" && needRegistration)) && (
                      <SignUpDialog />
                    )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Type</FormLabel>
    
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select patient type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Student">Student/Staff</SelectItem>
                              <SelectItem value="Non-Student">Non-Student</SelectItem>
                              <SelectItem value="StaffFamilyMember">Staff Family Member</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    {userType === 'StaffFamilyMember' && (
                      <>
                        <FormField
                          control={form.control}
                          name="staffId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Staff Member</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  setSelectedStaff(users?.data?.users?.find((u: any) => u.id === value));
                                  setSelectedFamilyMember(null);
                                }}
                                value={field.value?.toString()}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select staff member" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {staffOptions.map((option: any) => (
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
                        {selectedStaff && selectedStaff.family_members && selectedStaff.family_members.length > 0 && (
                        <FormField
                          control={form.control}
                          name="familyMemberId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Family Member</FormLabel>
                              <Select
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  const familyMember = selectedStaff?.family_members?.find(
                                    (member: any) => member.id === value
                                  );
                                  if (familyMember) {
                                    form.setValue('patientName', familyMember.name);
                                    form.setValue('gender', familyMember.gender || '');
                                    form.setValue('contactNumber', familyMember.contact_number || '');
                                    form.setValue('patientId', familyMember.id || '');
                                    //set other form fields as you need them.
                                  }
                                }}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select family member" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {familyMemberOptions.map((option: any) => (
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
                        )}
                      </>
                    )}
                    
                    <div className="flex space-x-2 items-end">
                      <FormField
                        control={form.control}
                        name="contactNumber"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Contact Number</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="e.g. 1234567890" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePatientLookup}
                        disabled={isLookupLoading}
                        className="mb-2"
                      >
                        {isLookupLoading ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Search className="h-4 w-4 mr-2" />
                        )}
                        {isLookupLoading ? "Searching..." : "Find"}
                      </Button>
                    </div>
                    
                    {userType === "Student" && (
                      <FormField
                        control={form.control}
                        name="studentNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student Number</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ''} placeholder="e.g. S12345" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="patientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Patient Name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                {/* Diagnosis Section */}
                <div className="space-y-4 md:col-span-2">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Diagnoses</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => appendIllness("")}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Illness
                    </Button>
                  </div>
                  {illnessFields.length === 0 && (
                    <p className="text-sm text-gray-500">No illnesses added yet</p>
                  )}

                  {illnessFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        {/* Fixed: Corrected the field name to match the schema */}
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
                                  {illnessOptions.map((option: any) => (
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
                          onClick={() => removeIllness(index)}
                          disabled={illnessFields.length === 1}
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
                
                {/* Medicine Section */}
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
                  
                  {fields.map((field, index) => (
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
                                  {medicineOptions.map((option : any) => (
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
              </div>
              
              {/* Form Error Message */}
              {Object.keys(form.formState.errors).length > 0 && (
                <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-600">
                  <p className="font-medium">Please correct the following errors:</p>
                   <ul className="list-disc pl-4 mt-2">
                    {Object.values(form.formState.errors).map((error, index) => (
                      <li key={index}>{error.message}</li>
                    ))}
                  </ul>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90" 
                disabled={isMutating}
              >
                {isMutating && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                Submit Treatment
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
      <CardFooter className="border-t p-6">
        <div className="text-sm text-muted-foreground">
          All fields are required unless marked optional. Medicines prescribed will be 
          automatically deducted from inventory.
        </div>
      </CardFooter>
    </Card>
  );
}