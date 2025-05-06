'use client'
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createTreatmentFn, fetchIllnessFn, fetchMedicinesFn, getUsersFn, useTransactionFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import useAuth from "@/hooks/use-auth";
import { Treatmentschema } from "@/lib/validations";
import { PatientInformation } from "./PatientInfoSection";
import { DiagnosisSection } from "./DiagnosisSection";
import { MedicineSection } from "./MedicineSection";
import { FormErrorDisplay } from "./FormError";



export default function TreatmentForm1() {
  interface Staff {
    id: string;
    name: string;
    family_members?: Array<{
      id: string;
      name: string;
    }>;
  }
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedFamilyMember, setSelectedFamilyMember] = useState(null);
  const [isRegisterFamilyMemberOpen, setIsRegisterFamilyMemberOpen] = useState(false);
  const [needRegistration, setNeedRegistration] = useState(false);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const queryClient = useQueryClient();
  const { user } = useAuth();


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
      blood_type: "",
      leave_notes: "",
      blood_pressure: "",
      forward_to_hospital: false,
      forwarded_by_hospital: false,
      severity: "MILD",
      patientId: "",
      medicines: [{ medicineId: "", quantity: 1, dosage: "" }],
      staffId: "",
      familyMemberId: ""
    }
  });
  
  // Define form type from the schema
  type FormValues = z.infer<typeof Treatmentschema>;


  const medicinesArray = useFieldArray<FormValues>({
    control: form.control,
    name: "medicines"
  });

  // For illnesses array
  const illnessArray = useFieldArray({
    control: form.control,
    name: "illnessIds" as any
  });

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


  // Mutations
  const treatmentMutation = useMutation({
    mutationFn: createTreatmentFn,
    onSuccess: () => toast({ 
      title: "Success",
      description: "Treatment recorded successfully" 
    }),
    onError: (error:any) => toast({ 
      title: "Error",
      description: error.data?.message || "Failed to record treatment", 
      variant: "destructive" 
    })
  });

  const transactionMutation = useMutation({ 
    mutationFn: useTransactionFn 
  });

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
    
    // Simulate network delay
    setTimeout(() => {
      const patient = users?.data?.users?.find(
        (u:any) => u.contact_number === contactNumber
      );
      
      if (patient) {
        form.setValue("patientName", patient.name);
        form.setValue("gender", patient.gender || '');
        if (patient.student_id && userType === "Student") {
          form.setValue("studentNumber", patient.student_id);
        }
        form.setValue("patientId", patient.id || '');
        form.setValue("blood_type", patient.blood_type || "")
        toast({
          title: "Patient Found",
          description: `Patient ${patient.name} found in the system.`
        });
      } else {
        setNeedRegistration(true);
        toast({
          title: "Patient Not Found",
          description: "No patient found with this contact number.",
          variant: "destructive"
        });
      }
      
      setIsLookupLoading(false);
    }, 500);
  };

  const checkStockAvailability = (data: any, ) => { 
    const insufficientStockMedicines = data.medicines.filter((prescribedMedicine: any) => {
        const medicineDetails = medicines?.data?.medicines?.find(
            (m: any) => m.id === prescribedMedicine.medicineId
        );

        if (!medicineDetails) {
            return true; 
        }

  
        const totalStock = medicineDetails?.batches?.reduce((sum: number, batch: any) => {
            return sum + batch.quantity;
        }, 0) || 0;

        return totalStock < prescribedMedicine.quantity;
    });

    if (insufficientStockMedicines.length > 0) {
        const errorMessage = insufficientStockMedicines.map((prescribedMedicine: any) => {
            const medicineDetails = medicines?.data?.medicines?.find(
                (m: any) => m.id === prescribedMedicine.medicineId
            );

             const totalStock = medicineDetails?.batches.reduce((sum: number, batch: any) => {
                return sum + batch.quantity;
            }, 0) || 0;

            return `${medicineDetails?.name || 'Unknown Medicine'}: Requested ${prescribedMedicine.quantity}, Available ${totalStock || 0}`;
        }).join(", ");

        toast({ 
            title: "Insufficient Stock",
            description: `Cannot proceed. Insufficient stock for: ${errorMessage}`,
            variant: "destructive",
        });

        return false;
    }

    return true;
};


  const onSubmit = async (data:any) => {
    if (user.userType !== 'HA') {
      return toast({
        title: "Error",
        description: "Unauthorized",
        variant: "destructive"
      });
    }

    // Check stock availability
    if (!checkStockAvailability(data)) return;

    try {
      const isStaffFamily = selectedStaff;

      // Determine patient or family member ID
      const patientId = isStaffFamily ? null : form.getValues("patientId");
      const familyMemberId = isStaffFamily ? form.getValues("patientId") : null;


      // Create treatment record
      const treatment = await treatmentMutation.mutateAsync({
        patient_id: patientId!,
        family_member_id: familyMemberId!,
        doctor_id: user.userId,
        illness_ids: data.illnessIds,
        severity: data.severity,
        notes: data.diagnosis,
        leave_notes: data.leave_notes,
        blood_pressure: data.blood_pressure,
        forwarded_by_hospital: data.forwarded_by_hospital,
        forward_to_hospital: data.forward_to_hospital,
        medicines: data.medicines.map((m:any) => ({ 
          medicine_id: m.medicineId, 
          dosage: m.dosage 
        }))
      });

      // Update medicine stock for each prescribed medicine
      await Promise.all(
        data.medicines.map((m:any) => transactionMutation.mutateAsync({
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
      queryClient.invalidateQueries({ queryKey: ['medicines'] });
      setSelectedStaff(null);
      setSelectedFamilyMember(null);
      // Reset form
      form.reset({
      userType: "Student",
      contactNumber: "",
      studentNumber: "",
      patientName: "",
      gender: "",
      illnessIds: [""],
      diagnosis: "",
      blood_type: "",
      blood_pressure: "",
      forward_to_hospital: false,
      forwarded_by_hospital: false,
      severity: "MILD",
      patientId: "",
      medicines: [{ medicineId: "", quantity: 1, dosage: "" }],
      staffId: "",
      familyMemberId: "",
    });
    } catch (error:any) {
      toast({ 
        title: "Error",
        description: error.data?.message || "Treatment recording failed", 
        variant: "destructive" 
      });
    }
  };

  const isLoading = usersLoading || medicinesLoading || illnessesLoading;
  const isMutating = treatmentMutation.isPending || transactionMutation.isPending;

  // Format options for dropdowns
  const formOptions = {
    illnessOptions: illnesses?.data?.illnesses?.map((i:any) => ({
      label: i.name,
      value: String(i.id)
    })) || [],
    
    medicineOptions: medicines?.data?.medicines?.map((m:any) => ({
      label: m.name,
      value: m.id
    })) || [],
    
    staffOptions: users?.data?.users
      ?.filter((u:any) => u.userType === 'STAFF' || u.userType === 'DEAN')
      .map((staff:any) => ({
        label: staff.name,
        value: staff.id,
      })) || [],
      
    familyMemberOptions: selectedStaff?.family_members?.map((member:any) => ({
      label: member.name,
      value: member.id,
    })) || []
  };

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
                <PatientInformation 
                  form={form}
                  userType={userType}
                  selectedStaff={selectedStaff}
                  setSelectedStaff={setSelectedStaff}
                  needRegistration={needRegistration}
                  users={users}
                  isLookupLoading={isLookupLoading}
                  handlePatientLookup={handlePatientLookup}
                  formOptions={formOptions}
                />
                
                {/* Diagnosis Section */}
                <DiagnosisSection 
                  form={form}
                  illnessArray={illnessArray}
                  formOptions={formOptions}
                />
                
                {/* Medicine Section */}
                <MedicineSection 
                  form={form}
                  medicinesArray={medicinesArray}
                  formOptions={formOptions}
                  medicines={medicines?.data.medicines}
                />
              </div>
              
              {/* Form Error Message */}
              <FormErrorDisplay formState={form.formState} />

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