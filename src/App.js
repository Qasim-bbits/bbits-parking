import React from 'react'
import { Routes, Route, Navigate, useLocation, useParams, useNavigate } from 'react-router-dom'
import './App.css'
import { router } from './Routes/routhPaths';
import LoginUtils from './Screens/Auth/Login/login.utils';
import MainUtils from './Screens/User/Main/Main.utils';
import SignupUtils from './Screens/Auth/SignUp/signUp.utils';
import VerifyUtils from './Screens/Auth/Verify/verify.utils';
import QRCodeUtils from './Screens/User/QRCode/QRCode.utils';
import ForgetPasswordUtils from './Screens/Auth/ForgetPassword/ForgetPassword.utils';
import HistoryUtils from './Screens/User/History/History.utils';
import MenuBar from "./layout/MenuBar";
import Dashboard from "./Screens/Admin/Dashboard/Dashboard";
import RatesUtils from "./Screens/Admin/Rates/RatesUtils";
import UsersUtils from "./Screens/Admin/Users/UsersUtils";
import ParkingsUtils from "./Screens/Admin/Parkings/ParkingsUtils";
import PlatesUtils from "./Screens/Admin/Plates/PlatesUtils";
import VisitorPlatesUtils from "./Screens/Admin/VisitorPlates/VisitorPlatesUtils";
import ProfileUtils from './Screens/User/Profile/Profile.utils';
import Cities from './Screens/Admin/Cities/Cities';
import Zones from './Screens/Admin/Zones/Zones';
import Organizations from './Screens/Admin/Organization/Organizations';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useEffect } from 'react';
import helpers from './Helpers/Helpers';
import Spinner from './shared/Spinner';
import organizationServices from './services/organization-service';
import Module from './Screens/Admin/Module/Module';
import Permissions from './Screens/Admin/Permissions/Permissions';
import mainService from './services/main-service';
import Ticket from './Screens/Admin/Ticket/Ticket';
import NotFound from './Screens/NotFound';
import TicketIssued from './Screens/Admin/TicketIssued/TicketIssued';
import PayTicket from './Screens/User/PayTicket/PayTicket';
import { config } from './Constants';
import ExternalParkingConfig from './Screens/Admin/ExternalParkingConfig/ExternalParkingConfig';
import TenentPlates from './Screens/Admin/TenentPlates/TenentPlates';
import Reporting from './Screens/Admin/Reporting/Reporting';
import Visitors from './Screens/User/Visitors/Visitors';
import ResidantPlates from './Screens/Admin/ResidantPlates/ResidantPlates';
import VisitorPass from './Screens/VisitorPass/VisitorPass';

import AgentLogin from './Screens/Agent/Auth/Login/login.utils';
import AgentForgetPassword from './Screens/Agent/Auth/ForgetPassword/ForgetPassword.utils';
import IssueTicket from './Screens/Agent/IssueTicket/IssueTicket';
import History from './Screens/Agent/History/History';
import BusinessPassPlates from './Screens/Admin/BusinessPassPlates/BusinessPassPlates';
import ConditionOfUse from './Screens/ConditionOfUse';
import PrivacyPolicy from './Screens/PrivacyPolicy';
import NoAuthHeader from './layout/NoAuthHeader';
import KickOutPlates from './Screens/Admin/KickOutPlates/KickOutPlates';
import { FloatingWhatsApp } from 'react-floating-whatsapp'

const App = () => {
  const location = useLocation();
  let navigate = useNavigate();
  const defaultColor = '#ddd';
  const [primaryColor, setPrimaryColor] = React.useState(defaultColor);
  const [showSpinner, setShowSpinner] = React.useState(false);
  const [apiCalled, setApiCalled] = React.useState(false);
  const [org, setOrg] = React.useState({});
  const [literals, setLiterals] = React.useState({});

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          primary: {
            main: primaryColor
          },
          secondary: {
            main: "#b1b1b1"
          },
          tertiary: {
            main: "#858585"
          }
        },
        components: {
          MuiDrawer: {
            styleOverrides: {
              paper: {
                background: "white",
                color: 'white'
              }
            }
          }
        },
        fontFamily: 'roboto' // as an aside, highly recommend importing roboto font for Material UI projects! Looks really nice
      }),
    [primaryColor],
  );

  useEffect(async () => {
    let res = await organizationServices.getOrgBySubDomain();
    if (res == undefined) {
      navigate(router.error)
    } else {
      setOrg(res)
      setPrimaryColor(res.color || res);
      setApiCalled(true);
    }
    let creds = JSON.parse(localStorage.getItem("loginCreds"));
    if (creds !== null) {
      getLiterals(creds.language, res.literal_sheet_url);
    } else {
      getLiterals(helpers.getLang(), res.literal_sheet_url);
    }
  }, [])

  const getLiterals = async (language, literal_sheet_url) => {
    setShowSpinner(true);
    let res = await helpers.getSheetData(language, literal_sheet_url);
    setLiterals(res);
    setShowSpinner(false);
  }

  const PrivateRoute = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem('userLogged'));
    if (user !== null) {
      return children
    }

    return <Navigate to={router.login} />
  }

  const AgentRoute = ({ children }) => {
    const user = JSON.parse(sessionStorage.getItem('userLogged'));
    if (user !== null) {
      if (user.result.role == "agent")
        return children
      else
        return <Navigate to={router.agent} />
    }

    return <Navigate to={router.agent} />
  }

  const AdminRoute = ({ children }) => {
    const isAdmin = JSON.parse(sessionStorage.getItem('userLogged'));
    if (isAdmin !== null) {
      let route = location.pathname.split('/');
      let permission = isAdmin?.result?.permissions.filter(x => x.module.key.toLowerCase().includes(route[2]) == true);
      if (permission[0].can_view == true) {
        return children
      }
    }
    return <Navigate to={'/'} />
  }

  function MissingRoute() {
    return <Navigate to={{ pathname: router.main }} />
  }

  return (
    <>
      {org.whatsapp_no && <FloatingWhatsApp phoneNumber={org.whatsapp_no} accountName={config.url.COMPANY_NAME}/>}
      <ThemeProvider theme={theme}>
        {Object.keys(literals).length > 0 && <Routes>
          <Route exact path={router.login} element={
            <LoginUtils
              org={org}
              literals={literals}
              getLiterals={(e) => getLiterals(e, org.literal_sheet_url)}
            />} />
          <Route exact path={router.signUp} element={<SignupUtils org={org} literals={literals} getLiterals={(e) => getLiterals(e, org.literal_sheet_url)} />} />
          <Route exact path={router.reset} element={<ForgetPasswordUtils org={org} literals={literals} />} />
          <Route exact path={router.verify + '/:token'} element={<VerifyUtils org={org} literals={literals} />} />
          <Route exact path={router.history} element={
            <PrivateRoute>
              <HistoryUtils org={org} literals={literals} />
            </PrivateRoute>}
          />
          <Route exact path={router.main} element={
            <PrivateRoute>
              <MainUtils apiCalled={apiCalled} org={org} literals={literals} />
            </PrivateRoute>}
          />
          <Route exact path={router.profile} element={
            <PrivateRoute>
              <ProfileUtils org={org} literals={literals} />
            </PrivateRoute>}
          />
          <Route exact path={router.visitor} element={
            <PrivateRoute>
              <Visitors org={org} literals={literals} />
            </PrivateRoute>}
          />
          <Route exact path={router.zone + '/:id'} element={<QRCodeUtils apiCalled={apiCalled} org={org} literals={literals} />} />
          <Route exact path={router.pay_ticket} element={<PayTicket org={org} literals={literals} />} />
          <Route path={router.admin} element={
            <AdminRoute>
              <MenuBar org={org} literals={literals} />
            </AdminRoute>
          }>
            <Route exact path={router.dashboard} element={<Dashboard org={org} literals={literals} />} />
            <Route exact path={router.module} element={<Module literals={literals} />} />
            <Route exact path={router.ticket} element={<Ticket org={org} literals={literals} />} />
            <Route exact path={router.tickets_issued} element={<TicketIssued org={org} literals={literals} />} />
            <Route exact path={router.external_parking_config} element={<ExternalParkingConfig org={org} literals={literals} />} />
            <Route exact path={router.permission} element={<Permissions literals={literals} />} />
            <Route exact path={router.organizations} element={<Organizations literals={literals} />} />
            <Route exact path={router.cities} element={<Cities org={org} literals={literals} />} />
            <Route exact path={router.rates} element={<RatesUtils org={org} literals={literals} />} />
            <Route exact path={router.users} element={<UsersUtils org={org} literals={literals} />} />
            <Route exact path={router.zones} element={<Zones org={org} literals={literals} />} />
            <Route exact path={router.businessPlates} element={<PlatesUtils literals={literals} />} />
            <Route exact path={router.tenentPlates} element={<TenentPlates literals={literals} org={org} />} />
            <Route exact path={router.businessPassPlates} element={<BusinessPassPlates literals={literals} org={org} />} />
            <Route exact path={router.residantPlate} element={<ResidantPlates literals={literals} org={org} />} />
            <Route exact path={router.reporting} element={<Reporting literals={literals} org={org} />} />
            <Route exact path={router.kickOutPlates} element={<KickOutPlates literals={literals} org={org} />} />
            <Route exact path={router.parkings + "/:id"} element={<ParkingsUtils org={org} literals={literals} />} />
          </Route>
          <Route path={router.admin} element={
            <MenuBar />
          }>
            <Route exact path={router.visitorPlates + "/:id"} element={<VisitorPlatesUtils />} />
          </Route>

          <Route path={router.agent}>
            <Route exact path={router.agentSignin} element={
              <AgentLogin org={org} literals={literals} getLiterals={(e) => getLiterals(e, org.literal_sheet_url)} />
            } />
            <Route exact path={router.agentReset} element={
              <AgentForgetPassword org={org} literals={literals} getLiterals={(e) => getLiterals(e, org.literal_sheet_url)} />
            } />
            <Route exact path={router.agentIssueTicket} element={
              <AgentRoute>
                <IssueTicket org={org} literals={literals} getLiterals={(e) => getLiterals(e, org.literal_sheet_url)} />
              </AgentRoute>
            } />
            <Route exact path={router.agentHistory} element={
              <AgentRoute>
                <History org={org} literals={literals} getLiterals={(e) => getLiterals(e, org.literal_sheet_url)} />
              </AgentRoute>
            } />

          </Route>

          <Route path={'/'} element={
              <NoAuthHeader org={org} />
          }>
            <Route exact path={router.conditionOfUse} element={<ConditionOfUse org={org} literals={literals}/>} />
            <Route exact path={router.privacyPolicy} element={<PrivacyPolicy org={org} literals={literals}/>} />
          </Route>
          <Route path="*" element={<MissingRoute />} />
          <Route exact path={router.error} element={<NotFound />} />
          <Route exact path={router.visitorPass + '/:id'} element={<VisitorPass org={org} literals={literals} />} />
        </Routes>}
        <Spinner
          spinner={showSpinner}
        />
      </ThemeProvider>
    </>
  );
}

export default App;