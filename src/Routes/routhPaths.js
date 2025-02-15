import {Receipt, LocalParking, ManageSearch, PersonOffOutlined, Person} from '@mui/icons-material';

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
  businessPassPlates: "/suite/business_pass_plates",
  residantPlate: "/suite/resident_plates",
  visitorPlates: "/suite/visitor_pass",
  module: "/suite/module",
  ticket: "/suite/ticket",
  tickets_issued: "/suite/tickets_issued",
  permission: "/suite/permission",
  profile: "/profile",
  external_parking_config: "/suite/external_parking_config",
  reporting: "/suite/reporting",
  kickOutPlates: "/suite/kick_out_plates",
  visitor: "/visitor",
  visitorPass: '/visitor_pass',
  agent: '/agent',
  agentSignin: '/agent',
  agentReset: '/agent/reset',
  agentIssueTicket: '/agent/issue_ticket',
  agentHistory: '/agent/history',
  conditionOfUse: "/condition_of_use",
  privacyPolicy: "/privacy_policy",
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
      title: 'park_visitor',
      path: router.visitor,
      icon: <LocalParking/>
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