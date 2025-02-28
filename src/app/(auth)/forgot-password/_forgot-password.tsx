"use client";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, MailCheckIcon, Loader } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo/index";
import { forgotPasswordMutationFn, getUserEmailFn, forgotPasswordForHAFn } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";

export default function ForgotPassword() {
  const params = useSearchParams();
  const email = params.get("email");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isHA, setIsHA] = useState<boolean>(false); // Track if user is HA
  const [secretKey, setSecretKey] = useState(""); // Store secret key for HA
  const [emailChecked, setEmailChecked] = useState(false); // Ensure email is verified before reset

  const formSchema = z.object({
    email: z.string().trim().email().min(1, { message: "Email is required" }),
    secret_key: z.string().trim().min(6, "Secret key must be at least 6 characters").optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: email || "" },
  });

  // ✅ Step 1: Check User Type (Student/Staff or HA)
  const { mutate: getUserEmail, isPending: isChecking } = useMutation({
    mutationFn: getUserEmailFn,
    onSuccess: (response) => {
      if (response.data.userType === "HA") {
        setIsHA(true); // User is HA, show secret key field
      } else {
        setIsHA(false); // Normal user
      }
      setEmailChecked(true);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.data?.message || "Failed to verify email.",
        variant: "destructive",
      });
    },
  });

  // ✅ Step 2: Regular Password Reset
  const { mutate: forgotPassword, isPending } = useMutation({
    mutationFn: forgotPasswordMutationFn,
    onSuccess: () => setIsSubmitted(true),
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ✅ Step 3: HA Password Reset (Requires Secret Key)
  const { mutate: forgotPasswordForHA, isPending: isResettingHA } = useMutation({
    mutationFn: forgotPasswordForHAFn, 
    onSuccess: () => setIsSubmitted(true),
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.data.message,
        variant: "destructive",
      });
    },
  });

  // ✅ Step 4: Handle Single Button Action
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!emailChecked) {
      getUserEmail({ email: values.email });
      return;
    }

    if (isHA) {
      forgotPasswordForHA({ email: values.email, secret_word: secretKey });
    } else {
      forgotPassword(values);
    }
  };

  return (
    <main className="w-full min-h-[590px] h-full max-w-full flex items-center justify-center">
      {!isSubmitted ? (
        <div className="w-full h-full p-5 rounded-md bg-white">
          <Logo />

          <h1 className="text-xl font-bold mb-1.5 mt-8 text-center sm:text-left">
            Reset password
          </h1>
          <p className="mb-6 text-center sm:text-left text-base">
            Enter your email, and we’ll send you reset instructions.
          </p>

          <Form {...form}>
            <form className="flex flex-col gap-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="mb-0">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="your-email@rub.edu.bt" autoComplete="off" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Secret Key Field (Only for HA) */}
              {isHA && (
                <div className="mb-0">
                  <FormLabel>Secret Key</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter Secret Key"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                  />
                </div>
              )}

              {/* Single Button for Both Actions */}
              <Button
                disabled={isPending || isResettingHA || isChecking || (isHA && secretKey.trim().length < 3)}
                className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90"
              >
                {isChecking && "Checking Email..."}
                {(isPending || isResettingHA) && <Loader className="animate-spin" />}
                {emailChecked ? "Send Reset Instructions" : "Verify Email"}
              </Button>

            </form>
          </Form>
        </div>
      ) : (
        <div className="w-full h-[80vh] flex flex-col gap-2 items-center justify-center rounded-md">
          <div className="size-[48px]">
            <MailCheckIcon size="48px" className="animate-bounce" />
          </div>
          <h2 className="text-xl font-bold">Check your email</h2>
          <p className="mb-2 text-center text-sm text-muted-foreground">
            We just sent a password reset link to {form.getValues().email}.
          </p>
          <Link href="/">
            <Button className="h-[40px] bg-gradient-to-r from-blue-500 to-indigo-600">
              Go to login
              <ArrowRight />
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
