import dashboardIcon from "../assets/img/dashboard-icon.svg";
import servicesIcon from "../assets/img/services-icon.svg";
import stationsIcon from "../assets/img/stations-icon.svg";
import projectGroupIcon from "../assets/img/project-group-icon.svg"
import membersIcon from "../assets/img/members-icon.svg";
import uploadDataSetIcon from "../assets/img/datasetIcon.svg"

export const PHONE_REGEX = 
// eslint-disable-next-line
/^(?![A-Za-z])[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/m

export const ADMIN_SIDE_NAV = [
  {
    linkName: "Dashboard",
    to: "/",
    icon: dashboardIcon,
  },
  {
    linkName: "Project Groups",
    to: "/projectGroup",
    icon: projectGroupIcon,
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
    linkName: "Upload Datasets",
    to: "/UploadDataset",
    icon: stationsIcon,
  }
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
  }
];

export const POC = "poc";

export const GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "id": 0,
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              0,
              0
            ],
            [
              0,
              0
            ],
            [
              0,
              0
            ],
            [
              0,
              0
            ]
          ]
        ]
      }
    }
  ]
};