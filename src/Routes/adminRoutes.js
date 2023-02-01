import { 
  DashboardOutlined, DirectionsCar, BackupTableOutlined, Public, 
  MapOutlined, Inventory2Outlined, Business, ViewModuleOutlined, 
  LockOpenOutlined, ConfirmationNumberOutlined, Settings, 
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
    icon: <MapOutlined />,
    value: "manage_cities",
  },
  {
    path: router.zones,
    icon: <Inventory2Outlined />,
    value: "manage_zones",
  },
  {
    path: router.rates,
    icon: <BackupTableOutlined />,
    value: "manage_rates",
  },
  {
    path: router.users,
    icon: <BackupTableOutlined />,
    value: "manage_users",
  },
  {
    path: router.tenentPlates,
    icon: <BackupTableOutlined />,
    value: "manage_tenent_plates",
  },
  {
    path: router.parkings+"/all",
    icon: <DirectionsCar />,
    value: "parkings",
  },
  {
    path: router.ticket,
    icon: <ConfirmationNumberOutlined />,
    value: "manage_tickets",
  },
  {
    path: router.tickets_issued,
    icon: <ConfirmationNumberOutlined />,
    value: "tickets_issued",
  },
  {
    path: router.external_parking_config,
    icon: <Settings />,
    value: "external_parking_config",
  },
];

export default adminRoutes;
