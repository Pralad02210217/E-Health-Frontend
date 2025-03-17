import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import {  changeSecretFn } from "@/lib/api";
import { CheckCircle, Loader, XCircle } from "lucide-react";

const schema = z.object({
  currentSecret: z.string().min(1, "Current SecretKey is required"),
  newSecret: z.string().min(6, "SecretKey must be at least 6 characters"),
  confirmNewSecret: z.string().min(6, "Confirm SecretKey is required"),
}).refine((data) => data.newSecret === data.confirmNewSecret, {
  message: "SecretKeys do not match",
  path: ["confirmNewSecretKey"],
});

export default function ChangeSecretModal({ open, onClose }: { open: boolean; onClose: () => void }) {
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
    mutationFn: (data: { currentSecret: string; newSecret: string }) => changeSecretFn(data),
    onSuccess: () => {
      setStatus("success");
      setTimeout(() => {
        setStatus(null);
        onClose()
        reset();

      }, 5000);
    },
    onError: (error:any) => {
        setStatus("error")
        setErrorMessage(error.data.message)

    },
  });

  const onSubmit = (data: any) => mutate({ currentSecret: data.currentSecret, newSecret: data.newSecret });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Secret Key</DialogTitle>
        </DialogHeader>
        
        {status === "success" ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="text-green-500 w-12 h-12" />
            <p className="text-green-600 font-semibold">SecretKey updated successfully</p>
          </div>
        ) : status === "error" ? (
          <div className="flex flex-col items-center gap-2">
            <XCircle className="text-red-500 w-12 h-12" />
            <p className="text-red-600 font-semibold">{errorMessage || "Failed to update Password"}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input type="password" placeholder="Current SecretKey" {...register("currentSecret")} />
              {errors.currentSecret && <p className="text-red-500 text-sm">{errors.currentSecret.message}</p>}
            </div>

            <div>
              <Input type="password" placeholder="New SecretKey" {...register("newSecret")} />
              {errors.newSecret && <p className="text-red-500 text-sm">{errors.newSecret.message}</p>}
            </div>

            <div>
              <Input type="password" placeholder="Confirm New SecretKey" {...register("confirmNewSecret")} />
              {errors.confirmNewSecret && <p className="text-red-500 text-sm">{errors.confirmNewSecret.message}</p>}
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
