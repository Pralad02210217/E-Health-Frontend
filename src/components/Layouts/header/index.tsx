'use client';
import Link from "next/link";
import { useSidebarContext } from "../sidebar/sidebar-context";
import { MenuIcon } from "./icons";
import { Notification } from "./notification";
import { ThemeToggleSwitch } from "./theme-toggle";
import { UserInfo } from "./user-info";
import Logo from "@/components/logo/index";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import useAuth from "@/hooks/use-auth";
import { Phone } from "lucide-react";

// A simple helper to format ISO dates to dd/mm/yyyy
const formatDate = (dateString: any) => {
  if (!dateString) return ""; // Handle cases where dateString is null or undefined
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
};

export function Header() {
  const { user, refetch } = useAuth()
  const { toggleSidebar, isMobile } = useSidebarContext();
  const available = user?.is_available;
  const isOnLeave = user?.is_onLeave;
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [refetch]);
  
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-stroke bg-white px-4 py-5 shadow-1 dark:border-stroke-dark dark:bg-gray-dark md:px-5 2xl:px-10">
      <button
        onClick={toggleSidebar}
        className="rounded-lg border px-1.5 py-1 dark:border-stroke-dark dark:bg-[#020D1A] hover:dark:bg-[#FFFFFF1A] lg:hidden"
      >
        <MenuIcon />
        <span className="sr-only">Toggle Sidebar</span>
      </button>
      
      {isMobile && (
        <Link href={"/"} className="ml-2 max-[430px]:hidden min-[375px]:ml-4">
          <Logo />
        </Link>
      )}
      
      <div className="max-xl:hidden">
        <h1 className="mb-0.5 text-heading-5 font-bold text-dark dark:text-white">
          E-Health CST
        </h1>
        <p className="font-medium">College Infirmary System</p>
      </div>
      
      <div className="flex flex-1 items-center justify-end gap-2 min-[375px]:gap-4">
        <div className="flex items-center gap-3">
          {isOnLeave ? (
            <>
              {/* Full badge for larger screens */}
              <Badge className="hidden sm:flex px-2 py-1 text-sm bg-red-100 text-red-700">
                On Leave from {formatDate(user?.start_date)} to {formatDate(user?.end_date)}
              </Badge>
              
              {/* Compact badge for mobile */}
              <Badge className="sm:hidden px-2 py-1 text-sm bg-red-100 text-red-700">
                On Leave
              </Badge>
            </>
          ) : (
            <>
              {/* Full badge for larger screens */}
              <Badge
                className={`hidden sm:flex px-2 py-1 text-sm items-center gap-1 ${
                  available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {available ? (
                  <>
                    HA Available 🟢
                    <Phone size={14} />
                    {user?.HA_Contact_Number !== '' ? user?.HA_Contact_Number : "17980451"}
                  </>
                ) : (
                  <>
                    <Phone size={14} />
                    HA Briefly Unavailable 🔴
                    <Phone size={14} />
                    {user?.HA_Contact_Number !== '' ? user?.HA_Contact_Number : "17980451"}
                  </>
                )}
              </Badge>
              
              {/* Compact badge for mobile - only shows phone number and color */}
              <Badge
                className={`sm:hidden flex px-2 py-1 text-sm items-center gap-1 ${
                  available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                <Phone size={14} />
                {user?.HA_Contact_Number !== '' ? user?.HA_Contact_Number : "17980451"}
                {available ? <span className="ml-1">🟢</span> : <span className="ml-1">🔴</span>}
              </Badge>
            </>
          )}
        </div>
        
        <div className="hidden sm:block">
          <ThemeToggleSwitch />
        </div>
        
        {user?.userType === "HA" && (
          <div className="hidden sm:block">
            <Notification />
          </div>
        )}
        
        <div className="shrink-0">
          <UserInfo />
        </div>
      </div>
    </header>
  );
}