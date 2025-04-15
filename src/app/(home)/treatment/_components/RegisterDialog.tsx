'use client'
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader, MailCheckIcon, UserCheckIcon } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { registerMutationFn, resendVerificationMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { 
  bloodTypeEnum, 
  emailSchema, 
  genderEnum, 
  PROGRAMME_ID_ENUM, 
  roleEnum, 
  userTypeEnum 
} from "@/utils/AuthEnums";

// Update the user type enum to include NON_STUDENT
const extendedUserTypeEnum = z.enum(["STUDENT", "STAFF", "NON-STAFF"]);

export function SignUpDialog() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resend, setResend] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });

 const formSchema = z
    .object({
      name: z.string().trim().min(2).max(100),
      student_id: z.union([
        // Student ID is optional for non-student types
        z.string().trim().min(8).max(8),
        z.string().optional()
      ]),
      email: z.union([
        // Validate email for STUDENT and STAFF
        z.string().refine((email) => {
          return /^\d{8}\.cst@rub\.edu\.bt$/.test(email) ||
            (!/^\d{8}/.test(email) && email.includes('@'));
        }, { message: "Invalid email format" }),
        // Allow optional email for NON-STAFF
        z.string().optional()
      ]),
      contact_number: z.union([
        z.string().trim().min(8).max(15).regex(/^\d+$/, "Invalid phone number"),
        z.string().optional()
      ]),
      password: z.union([
        z.string().trim().min(6).max(255),
        z.string().optional()
      ]),
      confirmPassword: z.union([
        z.string().trim().min(6).max(255),
        z.string().optional()
      ]),
      gender: genderEnum,
      blood_type: bloodTypeEnum.optional(),
      department_id: PROGRAMME_ID_ENUM,
      std_year: z.string().trim().max(1).optional(),
      user_type: extendedUserTypeEnum,
    })
    // Modify password match refinement
    .superRefine((data, ctx) => {
      // Only validate password match for STUDENT and STAFF
      if (data.user_type !== "NON-STAFF") {
        if (data.password !== data.confirmPassword) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Password does not match",
            path: ["confirmPassword"]
          });
        }
      }
    })
    // Conditional validations for Student-specific fields
    .refine((data) => {
      if (data.user_type === "STUDENT") {
        return !!data.student_id;
      }
      return true;
    }, {
      message: "Student ID is required for students",
      path: ["student_id"],
    })
    .refine((data) => {
      if (data.user_type === "STUDENT") {
        return !!data.std_year;
      }
      return true;
    }, {
      message: "Student Year is required for students",
      path: ["std_year"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      student_id: "",
      contact_number: "",
      gender: undefined,
      blood_type: undefined,
      password: "",
      confirmPassword: "",
      department_id: undefined,
      std_year: "",
      user_type: "STUDENT"
    },
  });

  const { mutate: resendVerification, isPending: isResending } = useMutation({
    mutationFn: resendVerificationMutationFn,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Verification email resent successfully!",
      });
      setIsSubmitted(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.data.message || "Failed to resend verification email.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(`onSubmit triggered`)
    // Create base submission values with required fields
    const submissionValues = {
      name: values.name,
      gender: values.gender,
      department_id: values.department_id,
      user_type: values.user_type,
      contact_number: values.contact_number || undefined,
      blood_type: values.blood_type,
      // Add optional fields based on user type
      ...(values.user_type !== "NON-STAFF" && {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      }),
      ...(values.user_type === "STUDENT" && {
        student_id: values.student_id,
        std_year: values.std_year,
      })
    };

    
    mutate(submissionValues, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error: any) => {
        if (error.data.message.includes("User already exists")) {
          setResend(true);
        }
        toast({
          title: "Error",
          description: error.data.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      // Reset form when dialog closes
      form.reset();
      setIsSubmitted(false);
      setResend(false);
    }
  };

  const userType = form.watch("user_type");

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90">
            Register Patient
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">Create an E-Health CST Account</DialogTitle>
        </DialogHeader>
        
        {!isSubmitted ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* User Type Field */}
              <FormField 
                control={form.control} 
                name="user_type" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                        <SelectItem value="NON-STAFF">Non-Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              {/* Conditional Email Field - Only for STUDENT and STAFF */}
              {userType !== "NON-STAFF" && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          autoComplete="off" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Conditional Contact Number Field - Optional for NON_STUDENT */}
              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Contact Number 
                      {userType === "NON-STAFF" && <span className="text-muted-foreground"> (Optional)</span>}
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="17XXXXX or 77XXXXXX" 
                        autoComplete="off" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Conditional Student Fields */}
              {userType === "STUDENT" && (
                <>
                  <FormField
                    control={form.control}
                    name="student_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your Student ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="std_year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Student Year</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your year of study" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Conditional Password Fields - Only for STUDENT and STAFF */}
              {userType !== "NON-STAFF" && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Enter your password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="Confirm your password" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Rest of the form remains the same... */}
              {/* Gender Field */}
              <FormField 
                control={form.control} 
                name="gender" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your Gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">MALE</SelectItem>
                        <SelectItem value="FEMALE">FEMALE</SelectItem>
                        <SelectItem value="OTHERS">OTHERS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              {/* Blood Type Field */}
              <FormField 
                control={form.control} 
                name="blood_type" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blood Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Blood type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              {/* Department Field */}
              <FormField 
                control={form.control} 
                name="department_id" 
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Programme</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Programme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[
                          { value: "P01", label: "ARCHITECTURE" },
                          { value: "P02", label: "CIVIL" },
                          { value: "P03", label: "ELECTRICAL" },
                          { value: "P04", label: "ECE" },
                          { value: "P05", label: "EG" },
                          { value: "P06", label: "ICE" },
                          { value: "P07", label: "IT" },
                          { value: "P08", label: "MECHANICAL" },
                          { value: "P09", label: "SOFTWARE" },
                          { value: "P10", label: "WR" },
                          { value: "P11", label: "No Department" }
                        ].map((prog) => (
                          <SelectItem key={prog.value} value={prog.value}>{prog.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} 
              />

              {/* Submit Button */}
              <Button 
                type="button" 
                className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90" 
                disabled={isPending}
                onClick={() => form.handleSubmit(onSubmit)()}
              >
                {isPending && <Loader className="mr-2 animate-spin" />}
                Create Account
                <ArrowRight className="ml-2" />
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center space-y-4 p-4">
           {userType === "NON-STAFF" ? (
              <>
                <UserCheckIcon size={48} className="mx-auto animate-bounce text-green-500" />
                <h2 className="text-xl font-bold">User Created Successfully</h2>
                <p className="text-muted-foreground">
                  Your account has been created.
                </p>
              </>
            ) : (
              <>
                <MailCheckIcon size={48} className="mx-auto animate-bounce" />
                <h2 className="text-xl font-bold">Check your email</h2>
                <p className="text-muted-foreground">
                  We just sent a verification link to {form.getValues().email}.
                </p>
              </>
            )}
            <Button 
              onClick={() => handleDialogOpenChange(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}