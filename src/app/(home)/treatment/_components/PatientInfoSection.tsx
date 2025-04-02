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
import { Loader2, Search } from "lucide-react";
import { FamilyRegistrationForm } from "./FamilyRegisterForm";
import { SignUpDialog } from "./RegisterDialog";

export function PatientInformation({
  form,
  userType,
  selectedStaff,
  setSelectedStaff,
  needRegistration,
  users,
  isLookupLoading,
  handlePatientLookup,
  formOptions
}:{
  form:any,
  userType:any,
  selectedStaff:any,
  setSelectedStaff:any,
  needRegistration:any,
  users:any,
  isLookupLoading:any,
  handlePatientLookup:any,
  formOptions:any
}) {
  return (
    <div className="space-y-4 md:col-span-2">
      <h3 className="text-lg font-medium">Patient Information</h3>
      
      {userType === 'StaffFamilyMember' && selectedStaff && (
        <FamilyRegistrationForm staffId={selectedStaff.id} onSuccess={() => {}} />
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
                      setSelectedStaff(users?.data?.users?.find((u:any) => u.id === value));
                    }}
                    value={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select staff member" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {formOptions.staffOptions.map((option:any) => (
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
                          (member:any) => member.id === value
                        );
                        if (familyMember) {
                          form.setValue('patientName', familyMember.name);
                          form.setValue('gender', familyMember.gender || '');
                          form.setValue('contactNumber', familyMember.contact_number || '');
                          form.setValue('patientId', familyMember.id || '');
                          form.setValue('blood_type',familyMember.blood_type || "")
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
                        {formOptions.familyMemberOptions.map((option:any) => (
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
            disabled
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
          disabled
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
          disabled
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
                <FormField
          control={form.control}
          name="blood_type"
          disabled
          render={({ field }) => (
            <FormItem>
              <FormLabel>Blood Type</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}