'use client';
import { useEffect, useState } from "react";
import useAuth from "@/hooks/use-auth";
import SetBriefLeave from "./_components/setBriefLeave";
import SetAvailable from "./_components/setAvailable";
import LeaveTable from "./_components/LeaveTable";
import SetLeave from "./_components/SetLeaves";
import { Badge } from "@/components/ui/badge";
import CancelLeaveModal from "./_components/CancelLeave";

// A simple helper to format ISO dates to dd/mm/yyyy
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

const Leaves = () => {
  const { user, refetch } = useAuth();
  const [available, setAvailable] = useState(false);
  const [isonLeave, setIsOnLeave] = useState(false);

  useEffect(() => {
    refetch();
    setAvailable(user?.is_available);
    if (user?.is_available === false && user?.is_onLeave === true) {
    setIsOnLeave(true);
  } else {
    setIsOnLeave(false);
  }
  }, [user, refetch]);

  const handleAvailabilityChange = () => {
    refetch();
  };

  console.log("User data:", user); // Debugging

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-2xl font-bold">Manage Leaves</h3>
          {isonLeave ? (
            <Badge className="px-2 py-1 text-sm bg-red-100 text-red-700">
              On Leave from {formatDate(user.start_date)} to {formatDate(user.end_date)}
            </Badge>
          ) : (
            <Badge
              className={`px-2 py-1 text-sm ${
                available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {available ? "Available 🟢" : "Briefly Unavailable 🔴"}
            </Badge>
          )}
        </div>
        {user && !user.is_available && user.isOnLeave && user.reason && (
          <p className="text-sm text-gray-600">Reason: {user.reason}</p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-6">
        {available ? (
          <SetBriefLeave onSuccesses={handleAvailabilityChange} disabled={isonLeave}/>
        ) : (
          <SetAvailable onSuccesses={handleAvailabilityChange}  disabled={isonLeave}/>
        )}
        {isonLeave ? (
          <CancelLeaveModal />
        ): (

          <SetLeave />
        )}
      </div>

      {/* Leave Table */}
      
      <LeaveTable />
    </div>
  );
};

export default Leaves;
