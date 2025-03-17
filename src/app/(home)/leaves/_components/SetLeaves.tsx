"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { setLeaveFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/use-auth";

// ✅ Zod Schema
export const setLeaveSchema = z
  .object({
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    reason: z
      .string()
      .min(5, { message: "Reason must be at least 5 characters long." })
      .max(500),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "End date must be after the start date.",
    path: ["end_date"],
  });

type SetLeaveFormValues = z.infer<typeof setLeaveSchema>;

const SetLeave = () => {
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const { refetch } = useAuth();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SetLeaveFormValues>({
    resolver: zodResolver(setLeaveSchema),
  });

  const startDate = watch("start_date");
  const endDate = watch("end_date");

  const { mutate: setLeave, isPending: isSettingLeave } = useMutation({
    mutationFn: setLeaveFn,
    onSuccess: () => {
      setIsLeaveModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      refetch();
      toast({ title: "Success", description: "Leave set successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to set leave.", variant: "destructive" });
    },
  });

  const onSubmit = (data: SetLeaveFormValues) => {
    setLeave({
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
      reason: data.reason,
    });
  };

  return (
    <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Set Leave</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Leave</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <Input
              type="date"
              value={startDate ? new Date(startDate).toISOString().split("T")[0] : ""}
              onChange={(e) => setValue("start_date", new Date(e.target.value))}
            />
            {errors.start_date && <p className="text-red-500 text-sm">{errors.start_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">End Date</label>
            <Input
              type="date"
              value={endDate ? new Date(endDate).toISOString().split("T")[0] : ""}
              onChange={(e) => setValue("end_date", new Date(e.target.value))}
            />
            {errors.end_date && <p className="text-red-500 text-sm">{errors.end_date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Reason</label>
            <Textarea {...register("reason")} placeholder="Reason for leave..." />
            {errors.reason && <p className="text-red-500 text-sm">{errors.reason.message}</p>}
          </div>

          <Button type="submit" disabled={isSettingLeave} className="w-full">
            {isSettingLeave ? "Submitting..." : "Confirm Leave"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetLeave;
