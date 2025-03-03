"use client";
import React, { useCallback, useState } from "react";
import SessionItem from "./SessionItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sessionDelAllMutationFn, sessionDelMutationFn, sessionsQueryFn } from "@/lib/api";
import { Loader } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Sessions = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsQueryFn,
    staleTime: Infinity,
  });
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: sessionDelMutationFn,
  });

  const sessions = data?.sessions || [];
  const queryClient = useQueryClient();

  const currentSession = sessions?.find((session) => session.isCurrent);
  const otherSessions = sessions?.filter(
    (session) => session.isCurrent !== true
  );
  
   const { mutate: deleteAllSessions, isPending: isLoggingOutAll } = useMutation({
    mutationFn: sessionDelAllMutationFn,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] })
      refetch()
      toast({ title: "Success", description:response.data.message });
      router.replace("/sign-in"); 
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.data.message, variant: "destructive" });
    },
  });

  const handleDelete = useCallback((id: string) => {
    mutate(id, {
      onSuccess: () => {
        refetch();
        toast({
          title: "Success",
          description: "Session removed successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  },[]);

  return (
    <div className="via-root to-root rounded-xl bg-gradient-to-r p-0.5 bg-white">
      <div className="rounded-[10px] p-6">
        <h3 className="text-xl tracking-[-0.16px] text-slate-12 font-bold mb-1">
          Sessions
        </h3>
        <p className="mb-6 max-w-xl text-sm text-[#0007149f] dark:text-gray-100 font-normal">
          Sessions are the devices you are using or that have used your E-Health CST
          These are the sessions where your account is currently logged in. You
          can log out of each session.
        </p>
        {isLoading ? (
          <Loader size="35px" className="animate-spin" />
        ) : (
          <div className="rounded-t-xl max-w-xl">
            <div>
              <h5 className="text-base font-semibold">
                Current active session
              </h5>
              <p className="mb-6 text-sm text-[#0007149f] dark:text-gray-100">
                You’re logged into this Squeezy account on this device and are
                currently using it.
              </p>
            </div>
            <div className="w-full">
              {currentSession && (
                <div className="w-full py-2 border-b pb-5">
                  <SessionItem
                    userAgent={currentSession.userAgent}
                    date={currentSession.created_at}
                    expires_at={currentSession.expires_at}
                    isCurrent={currentSession.isCurrent}
                  />
                </div>
              )}
              <div className="mt-4">
                <h5 className="text-base font-semibold">Other sessions</h5>
                <ul
                  className="mt-4 w-full space-y-3 max-h-[400px
                overflow-y-auto
                "
                >
                  {otherSessions?.map((session) => (
                    <li key={session.id}>
                      <SessionItem
                        loading={isPending}
                        userAgent={session.userAgent}
                        date={session.created_at}
                        expires_at={session.expires_at}
                        onRemove={() => handleDelete(session.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {data?.sessions?.length! > 1 && (
              <div className="mt-6">
                <Dialog modal open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Log out of all devices
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="text-center">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">Log out from all devices?</DialogTitle>
                    </DialogHeader>
                    <p className="mt-2 text-sm text-[#0007149f] dark:text-gray-100">
                      This will log you out from all devices including the current one.
                    </p>
                    <div className="flex justify-center gap-4 mt-6">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                     <Button
                      variant="destructive"
                      disabled={isLoggingOutAll}
                      onClick={() => {
                        console.log(`Trying to log out of all devices`);
                        setIsDialogOpen(false);
                        deleteAllSessions();
                      }}
                    >
                        {isLoggingOutAll ? "Logging out..." : "Confirm"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;