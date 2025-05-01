import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Feeds",
        url: "/users/feeds",
        icon: Icons.ActivityIcon,
        items: [],
      },
      {
        title: "Treatments",
        url: "/users/history",
        icon: Icons.HeartPulseIcon,
        items: [],
      },
      {
        title: "Student Visits",
        url: "/users/student",
        icon: Icons.SchoolIcon,
        items: [],
      },
      {
        title: "Dean",
        url: "/users/dean",
        icon: Icons.UserCheckIcon,
        items: [],
      },
    ],
  },
];
