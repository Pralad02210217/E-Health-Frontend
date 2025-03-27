'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { createStaffFamilyFn } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import DateOfBirthPicker from './DateBirthPicker';

const RegisterFamilyMemberSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  staff_id: z.string().min(1, { message: 'Staff ID is required' }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHERS'], { required_error: 'Please select gender' }),
  blood_type: z.enum(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']).optional(),
  contact_number: z.string().min(1, { message: 'Contact number is required' }),
  relation: z.enum(['CHILD', 'SPOUSE', 'PARENT', 'SIBLING', 'OTHER'], {
    required_error: 'Please select relation',
  }),
  date_of_birth: z.date({ required_error: 'Date of birth is required' }),
});

type RegisterFamilyMemberValues = z.infer<typeof RegisterFamilyMemberSchema>;

interface FamilyRegistrationFormProps {
  staffId: string;
  onSuccess: () => void;
}

export const FamilyRegistrationForm: React.FC<FamilyRegistrationFormProps> = ({
  staffId,
  onSuccess,
}) => {
  const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

  const form = useForm<RegisterFamilyMemberValues>({
    resolver: zodResolver(RegisterFamilyMemberSchema),
    defaultValues: {
      name: '',
      staff_id: staffId,
      gender: 'MALE',
      contact_number: '',
      blood_type:"O+",
      relation: 'CHILD',
      date_of_birth: new Date(),
    },
  });

  const [date, setDate] = useState<Date | undefined>(new Date());

  const mutation = useMutation({
    mutationFn: createStaffFamilyFn,
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    form.reset();
      toast({
        title: 'Success',
        description: 'Family member registered successfully.',
      });
      onSuccess();
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to register family member.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: RegisterFamilyMemberValues) => {
      mutation.mutate({
          ...data,
      });
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
        if(!newOpen){
            form.reset() 
        }
        setOpen(newOpen);
    }}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className='text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90'>
          Register Family Member
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register Family Member</DialogTitle>
          <DialogDescription>
            Enter the details of the family member you wish to register.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Name" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHERS">Others</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input placeholder="17XXXXXX/77XXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blood_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blood Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select BloodType" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectContent>
                            <SelectItem value="O+" >O+</SelectItem>
                            <SelectItem value="O-" >O-</SelectItem>
                            <SelectItem value="A+" >A+</SelectItem>
                            <SelectItem value="A-" >A-</SelectItem>
                            <SelectItem value="B+" >B+</SelectItem>
                            <SelectItem value="B-" >B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                          </SelectContent>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            

            <FormField
              control={form.control}
              name="relation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relation</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Relation" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CHILD">Child</SelectItem>
                      <SelectItem value="SPOUSE">Spouse</SelectItem>
                      <SelectItem value="PARENT">Parent</SelectItem>
                      <SelectItem value="SIBLING">Sibling</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <DateOfBirthPicker field={field} />
              )}
            />

            {/* ✅ Corrected Submit Button */}
            <Button 
              type="button" 
              disabled={mutation.isPending} 
              className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90"
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {mutation.isPending && <Loader className="animate-spin" />}
              {mutation.isPending ? "Registering..." : "Register Family Member"}
            </Button>
          </form>
        </Form>

      </DialogContent>
    </Dialog>
  );
};