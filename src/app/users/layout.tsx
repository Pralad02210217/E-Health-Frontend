import "@/css/satoshi.css";
import "@/css/style.css";


import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { ASidebar } from "@/components/Layouts/Asidebar";
import { SidebarProvider } from "@/components/Layouts/sidebar/sidebar-context";
import { ASidebarProvider } from "@/components/Layouts/Asidebar/sidebar-context";


export const metadata: Metadata = {
  title: {
    template: "%s CST E-Health Admin Page",
    default: "CST E-Health",
  },
  description:
    "Infirmary Management System for CST",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <ASidebarProvider>
      <div>
          <NextTopLoader showSpinner={false} />

          <div className="flex min-h-screen">
            <ASidebar />

            <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
              <Header />

              <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                {children}
              </main>
            </div>
          </div>
      </div>
    </ASidebarProvider>
  );
}
