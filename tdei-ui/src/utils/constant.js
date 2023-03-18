import dashboardIcon from "../assets/img/dashboard-icon.svg";
import servicesIcon from "../assets/img/services-icon.svg";
import stationsIcon from "../assets/img/stations-icon.svg";
import organizationIcon from "../assets/img/organization-icon.svg";
import membersIcon from "../assets/img/members-icon.svg";

export const PHONE_REGEX =
  //eslint-disable-next-line
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

export const ADMIN_SIDE_NAV = [
  {
    linkName: "Dashboard",
    to: "/",
    icon: dashboardIcon,
  },
  {
    linkName: "Organizations",
    to: "/organization",
    icon: organizationIcon,
  },
  {
    linkName: "Services",
    to: "/services",
    icon: servicesIcon,
  },
  {
    linkName: "Stations",
    to: "/stations",
    icon: stationsIcon,
  },
];

export const POC_SIDE_NAV = [
  {
    linkName: "Dashboard",
    to: "/",
    icon: dashboardIcon,
  },
  {
    linkName: "Services",
    to: "/services",
    icon: servicesIcon,
  },
  {
    linkName: "Stations",
    to: "/stations",
    icon: stationsIcon,
  },
  {
    linkName: "Members",
    to: "/members",
    icon: membersIcon,
  },
];

export const POC = "poc";
