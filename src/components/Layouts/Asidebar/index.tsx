"use client";

import Logo from "@/components/logo/index";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import useAuth from "@/hooks/use-auth";

// Interface for navigation items
interface NavItem {
  title: string;
  url?: string;
  icon?: React.ComponentType<{ className?: string; "aria-hidden"?: string }>;
  items: NavItem[];
}

interface NavSection {
  label: string;
  items: NavItem[];
}

export function ASidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Helper function to filter menu items based on user type
  const getFilteredNavItems = (items: NavItem[]) => {
    if (!user?.userType) return [];

    switch (user.userType) {
      case "STUDENT":
        return items.filter(item => 
          ["Feeds", "Treatments"].includes(item.title)
        );
      case "STAFF":
        return items.filter(item => 
          ["Feeds", "Treatments", "Student Visits"].includes(item.title)
        );
      case "DEAN":
        return items; // Show all items
      default:
        return [];
    }
  };

  // Filter the NAV_DATA based on user type
  const filteredNavData = NAV_DATA.map(section => ({
    ...section,
    items: getFilteredNavItems(section.items as any)
  })).filter(section => section.items.length > 0); // Remove empty sections

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => (prev.includes(title) ? [] : [title]));
  };

  useEffect(() => {
    // Keep collapsible open, when it's subpage is active
    filteredNavData.some((section) => {
      return section.items.some((item) => {
        return item.items.some((subItem) => {
          if (subItem.url === pathname) {
            if (!expandedItems.includes(item.title)) {
              toggleExpanded(item.title);
            }
            return true;
          }
        });
      });
    });
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          <div className="relative pr-4.5">
            <Link
              href={"/"}
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[850px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-3/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>
                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {filteredNavData.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>

                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section.items.map((item) => (
                      <li key={item.title}>
                        {item.items.length ? (
                          <div>
                            <MenuItem
                              isActive={item.items.some(
                                ({ url }) => url === pathname,
                              )}
                              onClick={() => toggleExpanded(item.title)}
                            >
                              {item.icon && (
                                <item.icon
                                  className="size-6 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span>{item.title}</span>
                              <ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                    "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItem
                                      as="link"
                                      href={subItem.url || `/${subItem.title.toLowerCase().split(" ").join("-")}`}
                                      isActive={pathname === (subItem.url || `/${subItem.title.toLowerCase().split(" ").join("-")}`)}
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          <MenuItem
                            className="flex items-center gap-3 py-3"
                            as="link"
                            href={item.url || `/${item.title.toLowerCase().split(" ").join("-")}`}
                            isActive={pathname === (item.url || `/${item.title.toLowerCase().split(" ").join("-")}`)}
                          >
                            {item.icon && (
                              <item.icon
                                className="size-6 shrink-0"
                                aria-hidden="true"
                              />
                            )}
                            <span>{item.title}</span>
                          </MenuItem>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
