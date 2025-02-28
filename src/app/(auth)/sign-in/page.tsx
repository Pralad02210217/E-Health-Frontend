"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ArrowRight, Loader } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
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
import Logo from "@/components/logo/index";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { loginMutationFn, resendVerificationMutationFn } from "@/lib/api";
import { useState } from "react";

export default function Login() {

  const router = useRouter()
  const [resend, setResend] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  const formSchema = z.object({
    email: z.string().trim().email().min(1).max(255).regex(/^[a-zA-Z0-9._%+-]+@rub\.edu\.bt$/,
      {message: "Email must be from cst.@rub.edu.bt domain"}),
    password: z.string().trim().min(6, {
      message: "Minimum Password length is 6",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values, {
      onSuccess: (response) =>{
        if(response.data.mfaRequired){
          router.replace(`/verify-mfa?email=${values.email}`)
          return;
        }
        router.replace(`/`)
      },
      onError: (error: any) =>{
        if(error.data.message.includes("Verify your email first")) setResend(true)
          toast({
          title: 'Error',
          description: error.data.message,
          variant: 'destructive'
        })
      }
    })
  };

  const { mutate: resendVerification, isPending: isResending } = useMutation({
      mutationFn: resendVerificationMutationFn,
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Verification email resent successfully!",
        });
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
  <div className="w-full h-screen overflow-hidden flex items-center justify-center">

      <div className="w-full max-w-md p-5 bg-white rounded-md shadow-lg overflow-auto">
        <div className="w-full h-full p-5 rounded-md">
          <Logo />

          <h1 className=" mt-5 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white text-center sm:text-left">
            Log in to E-Health CST
          </h1>
          <p className="mt-5 mb-6 text-sm text-gray-600 dark:text-gray-300 text-center sm:text-left">
            Don't have an account?{" "}
            <Link className="text-primary font-medium hover:underline" href="/sign-up">
              Sign up
            </Link>.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        <Input placeholder="subscribeto@channel.com"   className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:text-dark focus:outline-none"  {...field}/>
                      </FormControl>
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
                      <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                        Password
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="••••••••••••" {...field} className=" focus:text-dark" type="password"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              { resend ? (
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
                    ) : (
                      <div className="mb-4 flex w-full items-center justify-end">
                        <Link
                          className="text-sm dark:text-white"
                          href={`/forgot-password?email=${form.getValues().email}`}
                        >
                          Forgot your password?
                        </Link>
                      </div>
                    )}
              
              <Button
                className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90"
                disabled={isPending}
                type="submit"
              >
              {isPending && <Loader className="animate-spin" />}
                Sign in
                <ArrowRight />
              </Button>

              <div className="relative my-6 flex items-center">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
                <span className="px-3 text-sm text-gray-500 dark:text-gray-400">OR</span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700"></div>
              </div>
            </form>
          </Form>
          <Button variant="outline" className="w-full h-[40px]">
            Email magic link
          </Button>
          <p className="text-xs dark:text-slate- font-normal mt-7">
            By signing in, you agree to our{" "}
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
      </div>
    </div>
  );
}