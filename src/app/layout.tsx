import "@/css/satoshi.css";
import "@/css/style.css";
import { Sidebar } from "@/components/Layouts/sidebar";
import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";
import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import { ToastProvider } from "@/components/ui/toast";
import QueryProvider from "@/context/query-provider";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    template: "%s CST E-Health",
    default: "CST E-Health",
  },
  description:
    "Infirmary Management System for CST",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <ToastProvider>
            <Providers>
              <NextTopLoader showSpinner={false} />
              <div className="flex min-h-screen">
                <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
                  <main className="isolate mx-auto w-full max-w-screen-2xl overflow-hidden p-4 md:p-6 2xl:p-10">
                    {children}
                    <Toaster />
                  </main>
                </div>
              </div>
            </Providers>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}