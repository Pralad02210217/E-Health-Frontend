import { Icon } from "lucide-react";
import * as Icons from "../icons";

export type NavItem = {
  title: string;
  url?: string; 
  icon: React.ComponentType;
  items: NavItem[]; 
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        url: `/dashboard`,
        icon: Icons.DashboardIcon,
        items: [], 
      },
      {
        title: "Leaves",
        url: "/leaves",
        icon: Icons.LeavesIcon,
        items: [],
      },
      {
        title: "Feeds",
        url: "/feeds",
        icon: Icons.FeedsIcon,
        items: [],
      },
      {
        title: "Inventory",
        url: "/inventory",
        icon: Icons.InventoryIcon,
        items: [
          {
            title: "Inventory",
            url: "/inventory",
            icon: Icons.InventoryIcon,
            items: [],
          },
          {
            title: "Stocks",
            url: "/inventory/stock",
            icon: Icons.StocksIcon,
            items: [],
          },
        ],
      },
      {
        title: "Illness",
        url: "/illness",
        icon: Icons.IllnessIcon,
        items: [
          {
            title: "Illness Category",
            url: "/illnessCategory",
            icon: Icons.IllnessIcon,
            items: []
          },
          {
            title: "Illness",
            url: "/illness",
            icon: Icons.IllnessIcon,
            items: []
          }
        ],
      },
      {
        title: "Treatment",
        url: "/treatment",
        icon: Icons.TreatmentIcon,
        items: [],
      },
      {
        title: "Patient History",
        url: "/history",
        icon: Icons.PatientHistoryIcon,
        items: [],
      },
    ],
  },
];
