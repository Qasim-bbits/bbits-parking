import {Receipt, DashboardOutlined, ManageSearch, PersonOffOutlined, Person} from '@mui/icons-material';

export const router = {
  error: '/error',
  login: '/',
  signUp: '/signup',
  verify: '/verify',
  reset: '/reset',
  main: '/main',
  payForParking: '/ParkingPayment',
  payAnInfraction: '/InfractionPayment',
  history: '/history',
  zone: '/zone',
  pay_ticket: '/pay_ticket',
  suite: "/suite",
  dashboard: "/suite/dashboard",
  organizations: "/suite/organizations",
  cities: "/suite/cities",
  zones: "/suite/zones",
  rates: "/suite/rates",
  users: "/suite/users",
  parkings: "/suite/parkings",
  businessPlates: "/suite/business_plates",
  tenentPlates: "/suite/tenant_plates",
  visitorPlates: "/suite/visitor_pass",
  module: "/suite/module",
  ticket: "/suite/ticket",
  tickets_issued: "/suite/tickets_issued",
  permission: "/suite/permission",
  profile: "/profile",
  external_parking_config: "/suite/external_parking_config",
};

export const adminRoutes = [
  {
    parent: {
      title: 'profile',
      path: router.profile,
      icon: <Person />
    },
    child: []
  },
  {
    parent: {
      title: 'pay_for_parking',
      path: router.main,
      icon: <Receipt />
    },
    child: []
  },
  {
    parent: {
      title: 'history',
      path: router.history,
      icon: <ManageSearch />
    },
    child: []
  },
]