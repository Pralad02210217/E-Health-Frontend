import { useState, useEffect, JSX } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfileFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";


const departmentMap = {
  P01: "Architecture",
  P02: "BE CIVIL",
  P03: "BE ELECTRICAL",
  P04: "BE ECE",
  P05: "BE EG",
  P06: "BE ICE",
  P07: "BE IT",
  P08: "BE MECHANICAL",
  P09: "BE SOFTWARE",
  P10: "BE WATER",
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Select a valid gender" }),
  department_id: z.string().min(1, "Select a department"),
  blood_type: z.enum(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"], { message: "Select a blood type" }),
  contact_number: z.string().min(8).max(8, "Invalid contact number"),
  std_year: z.string().min(1, "Select a valid year").optional(),
  student_id: z.string().optional(),
});

type DepartmentId = keyof typeof departmentMap;

interface User {
  userType?: string;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  department_id: DepartmentId;
  blood_type: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  contact_number: string;
  std_year?: string;
  student_id?: string;
}

  


export default function PersonalInfoForm({ user, refetch }: { user: User, refetch:() => void }): JSX.Element {

  const isStudent = user?.userType === "STUDENT";
  const [isChanged, setIsChanged] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: user,
  });

  const departmentId = watch("department_id");
  const years = departmentId === "P01" ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];

  useEffect(() => {

    const subscription = watch(() => setIsChanged(true));
    return () => subscription.unsubscribe();
  }, [watch]);
    useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("gender", user.gender);
      setValue("department_id", user.department_id);
      setValue("blood_type", user.blood_type);
      setValue("contact_number", user.contact_number);
      setValue("std_year", user.std_year);
      setValue("student_id", user.student_id);
    }

  }, [user, setValue]);
  const queryClient = useQueryClient()

  const {mutate, isPending} = useMutation({
    mutationFn: (data: {
    name: string,
    gender: "MALE" | "FEMALE" | "OTHERS",
    contact_number: string,
    blood_type?: "O+"| "O-"| "A+"| "A-"| "B+"| "B-"| "AB+"| "AB-",
    department_id?: string
    }) => updateUserProfileFn(data),
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
      
      refetch()
      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      });
    },
  });


  const onSubmit = (data: any) => mutate(data);

  return (
    <Card className="max-w-lg mx-auto p-6">
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.name}{...register("name")} />
            {errors.name && <p className="text-red-500">{errors.name.message as string}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email}{...register("email")} disabled />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select  onValueChange={(val: "MALE" | "FEMALE" | "OTHER") => setValue("gender", val)}>
              <SelectTrigger className="text-dark">
                <SelectValue placeholder={user?.gender ||"Select Gender"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isStudent && (
            <div>
              <Label htmlFor="student_id">Student ID</Label>
              <Input id="student_id" defaultValue={user?.student_id} {...register("student_id")} disabled />
            </div>
          )}

          <div>
            <Label htmlFor="department">Department</Label>
            <Select onValueChange={(val: DepartmentId) => setValue("department_id", val)}>
              <SelectTrigger className="text-dark">
                <SelectValue placeholder={user?.department_id ? departmentMap[user.department_id] : "Select Department"} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(departmentMap).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="bloodType">Blood Type</Label>
            <Select defaultValue={user?.blood_type || ""} onValueChange={(val: "A+" | "A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-") => setValue("blood_type", val)}>
              <SelectTrigger>
                <SelectValue placeholder={user?.blood_type ||"Select Blood Type"} />
              </SelectTrigger>
              <SelectContent>
                {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className={!isStudent ? "mb-5": ""}>
            <Label htmlFor="contact">Contact Number</Label>
            <Input id="contact" defaultValue={user?.contact_number} {...register("contact_number")} />
            {errors.contact_number && <p className="text-red-500">{errors.contact_number.message as string}</p>}
          </div>

          {isStudent && (
            <div className="mb-5">
              <Label htmlFor="std_year">Student Year</Label>
              <Select  onValueChange={(val) => setValue("std_year", val)}>
                <SelectTrigger>
                  <SelectValue placeholder={user?.std_year || "Select your Year"} />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90" disabled={!isChanged || isPending}>
            {isPending && <Loader className="animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
