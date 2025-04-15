'use client'
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
  genderEnum 
} from "@/utils/AuthEnums";

export function SignUpHADialog() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn,
  });

  const formSchema = z
    .object({
      name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
      email: emailSchema,
      contact_number: z.string().trim().min(8, "Contact number must be at least 8 digits").max(15, "Contact number cannot exceed 15 digits")
        .regex(/^\d+$/, "Invalid phone number"),
      password: z.string().trim().min(6, "Password must be at least 6 characters").max(255),
      confirmPassword: z.string().trim().min(6, "Password must be at least 6 characters").max(255),
      gender: genderEnum,
      blood_type: bloodTypeEnum.optional(),
      secret_key: z.string().trim().min(6, "Secret key must be at least 6 characters").max(255),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      contact_number: "",
      gender: undefined,
      blood_type: undefined,
      password: "",
      confirmPassword: "",
      secret_key: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(`onSubmit triggered`)
    // Create submission values for HA user type
    const submissionValues = {
      name: values.name,
      email: values.email,
      gender: values.gender,
      contact_number: values.contact_number,
      blood_type: values.blood_type,
      password: values.password,
      confirmPassword: values.confirmPassword,
      secret_word: values.secret_key,
      user_type: "HA" as const, 
    };
    
    mutate(submissionValues, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.data?.message || "An error occurred during registration",
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
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90">
            Register Health Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">Create a Health Assistant Account</DialogTitle>
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
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter email" 
                        autoComplete="off" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Contact Number Field */}
              <FormField
                control={form.control}
                name="contact_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
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

              {/* Password Field */}
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

              {/* Confirm Password Field */}
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

              {/* Secret Key Field */}
              <FormField
                control={form.control}
                name="secret_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your secret key" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90" 
                disabled={isPending}
              >
                {isPending && <Loader className="mr-2 animate-spin" />}
                Create Account
                <ArrowRight className="ml-2" />
              </Button>
            </form>
          </Form>
        ) : (
          <div className="text-center space-y-4 p-4">
            <MailCheckIcon size={48} className="mx-auto animate-bounce" />
            <h2 className="text-xl font-bold">Check your email</h2>
            <p className="text-muted-foreground">
              We just sent a verification link to {form.getValues().email}.
            </p>
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