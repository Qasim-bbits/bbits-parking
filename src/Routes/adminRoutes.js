import { 
  DashboardOutlined, DirectionsCar, BackupTableOutlined, Public, 
  MapOutlined, Inventory2Outlined, Business, ViewModuleOutlined, 
  LockOpenOutlined, ConfirmationNumberOutlined, Settings, Report, LocationOnOutlined, PinDropOutlined, LocalOfferOutlined, PeopleAltOutlined, LocalParkingOutlined,
  East, 
} from "@mui/icons-material";
import {router} from "./routhPaths";

const adminRoutes = [
  {
    path: router.dashboard,
    icon: <DashboardOutlined />,
    value: "dashboard",
  },
  {
    path: router.main,
    icon: <Public />,
    value: "web_app",
  },
  {
    path: router.module,
    icon: <ViewModuleOutlined />,
    value: "manage_modules",
  },
  {
    path: router.permission,
    icon: <LockOpenOutlined />,
    value: "manage_permissions",
  },
  {
    path: router.organizations,
    icon: <Business />,
    value: "manage_organizations",
  },
  {
    path: router.cities,
    icon: <LocationOnOutlined />,
    value: "manage_cities",
  },
  {
    path: router.zones,
    icon: <PinDropOutlined />,
    value: "manage_zones",
  },
  {
    path: router.rates,
    icon: <LocalOfferOutlined />,
    value: "manage_rates",
  },
  {
    path: router.users,
    icon: <PeopleAltOutlined />,
    value: "manage_users",
  },
  {
    path: router.tenentPlates,
    icon: <DirectionsCar />,
    value: "manage_tenent_plates",
  },
  {
    path: router.residantPlate,
    icon: <DirectionsCar />,
    value: "manage_residant_plates",
  },
  {
    path: router.businessPassPlates,
    icon: <DirectionsCar />,
    value: "manage_business_pass_plates",
  },
  {
    path: router.kickOutPlates,
    icon: <East />,
    value: "kick_out_plates",
  },
  {
    path: router.parkings+"/all",
    icon: <LocalParkingOutlined />,
    value: "parkings",
  },
  {
    path: router.ticket,
    icon: <ConfirmationNumberOutlined />,
    value: "manage_tickets",
  },
  {
    path: router.tickets_issued,
    icon: <LocalOfferOutlined />,
    value: "tickets_issued",
  },
  {
    path: router.external_parking_config,
    icon: <Settings />,
    value: "external_parking_config",
  },
  {
    path: router.reporting,
    icon: <Report />,
    value: "reporting",
  },
];

export default adminRoutes;
