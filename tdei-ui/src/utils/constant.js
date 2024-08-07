import dashboardIcon from "../assets/img/dashboard-icon.svg";
import servicesIcon from "../assets/img/services-icon-menu.svg";
import stationsIcon from "../assets/img/stations-icon.svg";
import projectGroupIcon from "../assets/img/project-group-icon.svg"
import membersIcon from "../assets/img/members-icon.svg";
import datasetIcon from "../assets/img/dataset-icon-menu.svg";
import uploadDataSetIcon from "../assets/img/datasetIcon.svg"
import jobsIcon from "../assets/img/icon_jobs.svg"

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
    linkName:"Datasets",
    to:"/datasets",
    icon: datasetIcon
  },
  {
     linkName: "Jobs",
     to: "/jobs",
     icon: jobsIcon
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
    linkName: "Members",
    to: "/members",
    icon: membersIcon,
  },
  {
    linkName:"Datasets",
    to:"/datasets",
    icon: datasetIcon
  },
  {
    linkName: "Jobs",
    to: "/jobs",
    icon: jobsIcon
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

export const SPATIAL_JOIN = {
  "target_dataset_id": "",
  "target_dimension": "",
  "source_dataset_id": "",
  "source_dimension": "",
  "join_condition": "",
  "join_filter_target": "",
  "join_filter_source": "",
  "aggregate": []
};

export const SAMPLE_SPATIAL_JOIN = {
  "target_dataset_id": "fa8e12ea-6b0c-4d3e-8b38-5b87b268e76b",
  "target_dimension": "edge",
  "source_dataset_id": "0d661b69495d47fb838862edf699fe09",
  "source_dimension": "point",
  "join_condition": "ST_Intersects(ST_Buffer(geometry_target, 5), geometry_source)",
  "join_filter_target": "highway='footway' AND footway='sidewalk'",
  "join_filter_source": "highway='street_lamp'",
  "aggregate": [
    "ARRAY_AGG(highway) as lamps",
  ]
};