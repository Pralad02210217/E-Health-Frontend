import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { changePasswordFn } from "@/lib/api";
import { CheckCircle, Loader, XCircle } from "lucide-react";

const schema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmNewPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

export default function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const [status, setStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
        if (open) {
            reset();
            setStatus(null);
            setErrorMessage("");
        }
    }, [open, reset]);


  const { mutate, isPending } = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) => changePasswordFn(data),
    onSuccess: () => {
      setStatus("success");
      setTimeout(() => {
        setStatus(null);
        reset();

      }, 2000);
    },
    onError: (error:any) => {
        setStatus("error")
        setErrorMessage(error.data.message)

    },
  });

  const onSubmit = (data: any) => mutate({ currentPassword: data.currentPassword, newPassword: data.newPassword });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        
        {status === "success" ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="text-green-500 w-12 h-12" />
            <p className="text-green-600 font-semibold">Password updated successfully</p>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center gap-2">
            <XCircle className="text-red-500 w-12 h-12" />
            <p className="text-red-600 font-semibold">{errorMessage || "Failed to update Password"}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input type="password" placeholder="Current Password" {...register("currentPassword")} />
              {errors.currentPassword && <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <Input type="password" placeholder="New Password" {...register("newPassword")} />
              {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
            </div>

            <div>
              <Input type="password" placeholder="Confirm New Password" {...register("confirmNewPassword")} />
              {errors.confirmNewPassword && <p className="text-red-500 text-sm">{errors.confirmNewPassword.message}</p>}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isPending} className="w-full text-[15px] h-[40px] text-white font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg hover:opacity-90">
                {isPending && <Loader className="animate-spin" />}
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
