"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { invokeMFAFn } from "@/lib/api";
import RevokeMfa from "./_common/RevokeMfa";
import useAuth from "@/hooks/use-auth";


const EnableMfa = () => {
  const [isOpen, setIsOpen] = useState(false);

  const {user, refetch} = useAuth();
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: invokeMFAFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      
      refetch()
      setIsOpen(false);
      toast({ title: "Success", description: "MFA has been enabled successfully." });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
  const mfaRequired = user?.mfa_required || false

  return (
    <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5 bg-white mb-5">
      <div className="rounded-[10px] p-6">
        <div className="flex items-center gap-3">
          <h3 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mb-1">
            Multi-Factor Authentication (MFA)
          </h3>
        </div>
        <p className="mb-6 text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Protect your account by adding an extra layer of security.
        </p>
        {mfaRequired ? (
          <RevokeMfa />
        ) : (
          <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90">Enable MFA</Button>
          </DialogTrigger>
          <DialogContent className="text-center">
            <DialogHeader>
              <DialogTitle className="text-[17px] text-slate-12 font-semibold">
                Enable Multi-Factor Authentication
              </DialogTitle>
            </DialogHeader>
            <p className="mt-4 text-sm text-[#0007149f] dark:text-gray-100">
              Are you sure you want to enable MFA? This will require you to enter an OTP sent to your email every time you log in.
            </p>
            <div className="flex justify-center gap-4 mt-6">
              <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
              <Button disabled={isPending} onClick={() => mutate()}>
                {isPending ? "Enabling..." : "Verify"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        )}

        
      </div>
    </div>
  );
};

export default EnableMfa;
