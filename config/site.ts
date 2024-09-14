import { MdOutlineSpaceDashboard, MdPayment } from "react-icons/md";
import { FaCarSide } from "react-icons/fa";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "ETC System",
  description:
    "Enables easy toll payment management, balance tracking, and real-time toll history for users, with secure, efficient administration tools.",
  navItems: [
    {
      label: "Home",
      href: "/",
      icon: MdOutlineSpaceDashboard,
    },
    {
      label: "Vehicles",
      href: "/vehicles",
      icon: FaCarSide,
    },
    {
      label: "Payment",
      href: "/payment",
      icon: MdPayment,
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/nextui-org/nextui",
    twitter: "https://twitter.com/getnextui",
    docs: "https://nextui.org",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
