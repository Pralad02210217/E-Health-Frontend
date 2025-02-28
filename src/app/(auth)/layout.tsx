'use client'
import { Toast } from "@/components/ui/toast";
import { DM_Sans } from "next/font/google";
import { usePathname } from "next/navigation";
const dm_sans = DM_Sans({ subsets: ["latin"] });
export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const pathname = usePathname(); 
    const isSignUpPage = pathname === "/sign-up";
    return (
      <div className={`bg-background ${dm_sans.className} antialiased ${isSignUpPage ? "overflow-auto" : "overflow-hidden"}`}>
        <div className="w-full h-auto">
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full max-w-[450px] mx-auto h-auto ">{children}</div>
        </div>
      </div>
      </div>
    );
  }