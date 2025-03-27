"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
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
import { ArrowRight, Loader, MailCheckIcon } from "lucide-react";
import Logo from "@/components/logo/index";
import { useMutation } from "@tanstack/react-query";
import { registerMutationFn, resendVerificationMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { bloodTypeEnum, emailSchema, genderEnum, PROGRAMME_ID_ENUM, roleEnum, userTypeEnum } from "@/utils/AuthEnums";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



export default function SignUp() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resend, setResend] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });

 const formSchema = z
    .object({
      name: z.string().trim().min(2).max(100),
      student_id: z.string().trim().min(8).max(8).optional(), 
      email: emailSchema, 
      contact_number: z.string().trim().min(8).max(15).regex(/^\d+$/, "Invalid phone number"),
      password: z.string().trim().min(6).max(255),
      confirmPassword: z.string().trim().min(6).max(255),
      gender: genderEnum,
      blood_type: bloodTypeEnum.optional(),
      department_id: PROGRAMME_ID_ENUM, 
      std_year: z.string().trim().max(1).optional(), 
      user_type: userTypeEnum,  // "STUDENT" | "STAFF"
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password does not match",
      path: ["confirmPassword"],
    })
    .refine((data) => {
      if (!data.email) return true; // Skip validation if email is missing

      if (data.user_type === "STUDENT") {
        return /^\d{8}\.cst@rub\.edu\.bt$/.test(data.email);
      } else if (data.user_type === "STAFF") {
        return !/^\d{8}/.test(data.email); // Staff email should NOT start with 8 digits
      }
      return true;
    }, {
      message: "Invalid email format for the selected user type",
      path: ["email"],
    })
    .refine((data) => {
      if (data.user_type === "STUDENT") {
        return !!data.student_id; // Student ID must be present
      }
      return true;
    }, {
      message: "Student ID is required for students",
      path: ["student_id"],
    })
    .refine((data) => {
      if (data.user_type === "STUDENT") {
        return !!data.std_year; // Student year must be present
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {

    mutate(values, {
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

  const { mutate: resendVerification, isPending: isResending } = useMutation({
    mutationFn: resendVerificationMutationFn,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Verification email resent successfully!",
      });
      setIsSubmitted(true)
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.data.message || "Failed to resend verification email.",
        variant: "destructive",
      });
    },
  });


  return (
    <>
      <main className="w-full min-h-[590px] h-auto max-w-full pt-10 bg-white rounded-md">
        {!isSubmitted ? (
          <div className="w-full p-5 rounded-md">
            <Logo />

            <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white text-center sm:text-left">
              Create a E-Health CST account
            </h1>
            <p className="mt-5 mb-6 text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
              Already have an account?{" "}
              <Link className="text-primary" href="/sign-in">
                Sign in
              </Link>
              .
            </p>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Name
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Techwithemma" className=" focus:text-dark" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-4">
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="subscribeto@channel.com"
                            autoComplete="off"
                            className=" focus:text-dark"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                  
                 {form.watch("user_type") === "STUDENT" && (
                  <>
                    <div className="mb-4">
                      <FormField
                        control={form.control}
                        name="student_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student ID</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your Student ID" className=" focus:text-dark" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mb-4">
                      <FormField
                        control={form.control}
                        name="std_year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Student Year</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your year of study" className=" focus:text-dark" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </>
                )}
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="contact_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Contact Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="17XXXXX or 77XXXXXX"
                            autoComplete="off"
                            className=" focus:text-dark"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>
                  <div className="mb-4">
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
                              <SelectItem value="MALE" className="data-[state=checked]:bg-gray-200">MALE</SelectItem>
                              <SelectItem value="FEMALE" className="data-[state=checked]:bg-gray-200">FEMALE</SelectItem>
                              <SelectItem value="OTHERS" className="data-[state=checked]:bg-gray-200">OTHERS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} 
                    />
                  </div>
                  <div className="mb-4">
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
                            <SelectItem value="O+" className="data-[state=checked]:bg-gray-200">O+</SelectItem>
                            <SelectItem value="O-" className="data-[state=checked]:bg-gray-200">O-</SelectItem>
                            <SelectItem value="A+" className="data-[state=checked]:bg-gray-200">A+</SelectItem>
                            <SelectItem value="A-" className="data-[state=checked]:bg-gray-200">A-</SelectItem>
                            <SelectItem value="B+" className="data-[state=checked]:bg-gray-200">B+</SelectItem>
                            <SelectItem value="B-" className="data-[state=checked]:bg-gray-200">B-</SelectItem>
                            <SelectItem value="AB+" className="data-[state=checked]:bg-gray-200">AB+</SelectItem>
                            <SelectItem value="AB-" className="data-[state=checked]:bg-gray-200">AB-</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                <div className="mb-4">
                  <FormField 
                    control={form.control} 
                    name="department_id" 
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Programme</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Programme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="P01" className="data-[state=checked]:bg-gray-200">ARCHITECTURE</SelectItem>
                            <SelectItem value="P02" className="data-[state=checked]:bg-gray-200">CIVIL</SelectItem>
                            <SelectItem value="P03" className="data-[state=checked]:bg-gray-200">ELECTRICAL</SelectItem>
                            <SelectItem value="P04" className="data-[state=checked]:bg-gray-200">ECE</SelectItem>
                            <SelectItem value="P05" className="data-[state=checked]:bg-gray-200">EG</SelectItem>
                            <SelectItem value="P06" className="data-[state=checked]:bg-gray-200">ICE</SelectItem>
                            <SelectItem value="P07" className="data-[state=checked]:bg-gray-200">IT</SelectItem>
                            <SelectItem value="P08" className="data-[state=checked]:bg-gray-200">MECHANICAL</SelectItem>
                            <SelectItem value="P09" className="data-[state=checked]:bg-gray-200">SOFTWARE</SelectItem>
                            <SelectItem value="P010" className="data-[state=checked]:bg-gray-200">WR</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} 
                  />
                </div>
                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••••••"
                            className=" focus:text-dark"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mb-4">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Confirm Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••••••"
                            className=" focus:text-dark"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                { resend && (
                    <div className="mb-4 flex w-full items-center justify-end">
                      <button
                        type="button"
                        className="text-sm dark:text-white hover:underline"
                        onClick={() => {
                          const email = form.getValues().email
                          console.log("Resending verification to:", email)
                          resendVerification({ email })
                        }}
                        disabled={isResending}
                      >
                        {isResending ? "Resending..." : "Resend Verification Link?"}
                      </button>
                    </div>
                    )}

                <Button
                  className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90"
                  disabled={isPending}
                  type="submit"
                >
                  {isPending && <Loader className="animate-spin" />}
                  Create account
                  <ArrowRight />
                </Button>

                <div className="mb-4 mt-4 flex items-center justify-center">
                  <div
                    aria-hidden="true"
                    className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
                    data-orientation="horizontal"
                    role="separator"
                  ></div>
                  <span className="mx-4 text-xs dark:text-[#f1f7feb5] font-normal">
                    OR
                  </span>
                  <div
                    aria-hidden="true"
                    className="h-px w-full bg-[#eee] dark:bg-[#d6ebfd30]"
                    data-orientation="horizontal"
                    role="separator"
                  ></div>
                </div>
              </form>
            </Form>
            <Button variant="outline" className="w-full h-[40px]">
              Email magic link
            </Button>
            <p className="text-xs font-normal mt-4">
              By signing up, you agree to our{" "}
              <a className="text-primary hover:underline" href="#">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-primary hover:underline" href="#">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        ) : (
          <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
            <div className="size-[48px]">
              <MailCheckIcon size="48px" className="animate-bounce" />
            </div>
            <h2 className="text-xl tracking-[-0.16px] dark:text-[#fcfdffef] font-bold">
              Check your email
            </h2>
            <p className="mb-2 text-center text-sm text-muted-foreground dark:text-[#f1f7feb5] font-normal">
              We just sent a verification link to {form.getValues().email}.
            </p>
            <Link href="/sign-in">
              <Button className="h-[40px] bg-gradient-to-r from-blue-500 to-indigo-600">
                Go to login
                <ArrowRight />
              </Button>
            </Link>
          </div>
        )}
      </main>
    </>
  );
}