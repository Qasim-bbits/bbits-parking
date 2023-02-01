import React, {useState, useEffect, useCallback, useRef} from 'react';
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import logo from "../../assets/images/Logos/logo.svg";
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  ListItemButton,
  ListItemText,
  useMediaQuery,
  Button,
  Typography,
  useTheme
} from '@mui/material';
import {DashboardOutlined, Login} from '@mui/icons-material';
import {adminRoutes, router} from "../../Routes/routhPaths";
import Spinner from '../../Common/Spinner';
import mainService from '../../services/main-service';
import CurrentParking from './CurrentParking.view';
import { config } from '../../Constants';
import ParkIn from '../Icons/ParkIn';
const moment = require('moment-timezone');
moment.tz.setDefault("America/New_York");

export const SidebarView = (props) => {
  const theme = useTheme();
  let navigate = useNavigate();
  const location = useLocation()
  const { open, onClose } = props;
  const user = JSON.parse(sessionStorage.getItem("userLogged"));
  const plates = JSON.parse(localStorage.getItem("plates"));
  const [parking, setParking] = useState([]);
  const [selectedParking, setSelectedParking] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [showParkings ,setShowParkings] = useState(false);

  useEffect(()=>{
    getCurrentParking();
  },[])

  const getCurrentParking = async()=>{
    setShowSpinner(true);
    let showDrawer = sessionStorage.getItem("showParking")
    if(user !== null){
        const res = await mainService.getCurrentParking({user_id: user.result._id});
        setParking(res.data)
        setSelectedParking(res.data[0]);
        if(res.data.length > 0 && showDrawer == null){
          sessionStorage.setItem("showParking", true)
          setShowParkings(true)
        }
    }else if(plates !== null){
      const res = await mainService.getCurrentParkingsByPlate({plates: plates});
      setParking(res.data)
      setSelectedParking(res.data[0]);
      if(res.data.length > 0 && showDrawer == null){
        sessionStorage.setItem("showParking", true)
        setShowParkings(true)
      }
    }
    setShowSpinner(false);
  }

  const calculateDuration = eventTime => moment.duration(Math.max(eventTime - (Math.floor(moment().toDate() / 1000)), 0), 'seconds');

  function Countdown({ eventTime, interval }) {
    const [duration, setDuration] = useState(calculateDuration(eventTime));
    const timerRef = useRef(0);
    const timerCallback = useCallback(() => {
      setDuration(calculateDuration(eventTime));
    }, [eventTime])

    useEffect(() => {
      timerRef.current = setInterval(timerCallback, interval);

      return () => {
        clearInterval(timerRef.current);
      }
    }, [eventTime]);

    return (
      <div>
        
          {(duration.days() === 0 ? "" : duration.days() + "d ")}
          {(duration.hours() === 0 ? "" : duration.hours() + "h ")}
          {(duration.minutes() === 0 ? "" : duration.minutes() + "m ")}
          {duration.seconds() + "s "}
        
      </div>
    )
  }

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'), {
    defaultMatches: true,
    noSsr: false
  });

  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'), {
    defaultMatches: true,
    noSsr: false
  });

  const isAdmin = JSON.parse(sessionStorage.getItem('userLogged'));

  const getFirstRoute = ()=>{
    let permission = isAdmin.result?.permissions.filter(x=>x.can_view == true);
    return router.suite +"/"+ permission[0].module.key;
  }

  const content = (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f0f2f5',
          height: '100%',
        }}
      >
        <Box 
          sx={{ display: 'flex', justifyContent: 'space-around', marginTop: '5%', cursor: 'pointer' }} 
          onClick={()=>navigate(router.main)}
        >
          <img src={config.url.file_url+props.org?.logo} width= '80%' alt="" />
        </Box>
        <Divider
          sx={{
            my: 1
          }}
        />
        {parking.length > 0 && 
          <Button 
            onClick={()=>{setShowParkings(true);}}
            sx={{
              display: 'flex', width: '100%', marginTop: 1, 
              justifyContent: 'space-between', alignItems: 'flex-end',
              }}
          >
            <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{mb: '16px', mx: 1}}>
                  <ParkIn color={theme.palette.primary.main} width={'25'}/>
                </Box>
                {parking[0].plate}
              </Box>
            </Typography>
            <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', alignSelf: 'center', fontWeight: "bold", textTransform: "lowercase"}} >
              <Box>
                <Countdown eventTime={moment(parking[0].to).unix()} interval={1000} />
              </Box>
            </Typography>
          </Button>
        }
        {(isAdmin?.result?.role === 'admin' || isAdmin?.result?.role === 'root') && 
        <NavLink
          to={getFirstRoute()}
          style={{color: theme.palette.primary.main, textDecoration: 'none'}}
        >
          <ListItemButton>
              <DashboardOutlined/>  &nbsp;
              <ListItemText primary={props.literals.dashboard}/>
          </ListItemButton>
        </NavLink>}
        {(isAdmin !== null) && adminRoutes.map(route=>{
          return(
            <NavLink
              to={route.parent.path}
              style={({ isActive }) => (isActive ?
                {color: theme.palette.primary.main, borderLeft: '3px solid '+theme.palette.primary.main, textDecoration: 'none'} : {color: theme.palette.primary.main, textDecoration: 'none'})}
            >
              <ListItemButton>
                  {route.parent.icon} &nbsp;
                  <ListItemText primary={props.literals[route.parent.title]}/>
              </ListItemButton>
            </NavLink>
          )
        })}
        {isAdmin == null && 
          <NavLink
            to={router.login}
            style={({ isActive }) => (isActive ?
              {color: '#14a7e0', textDecoration: 'none'} : {color: theme.palette.primary.main, textDecoration: 'none'})}
          >
            <ListItemButton>
                {<Login/>} &nbsp;
                <ListItemText primary={props.literals.sign_up + ' / ' + props.literals.log_in}/>
            </ListItemButton>
          </NavLink>
        }
      </Box>
    </>
  );

  if (lgUp && !showParkings) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <>
      <Drawer
        anchor="left"
        onClose={onClose}
        open={open}
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.900',
            color: '#FFFFFF',
            width: 280
          }
        }}
        sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
        variant="temporary"
      >
        {content}
      </Drawer>
      <Drawer
        anchor={"left"}
        open={showParkings}
        onClose={()=>setShowParkings(false)}
        variant="temporary"
        PaperProps={{
          sx: {
            backgroundColor: '#fff',
            width: smDown ? '100%' : 600,
          }
        }}
      >
        <CurrentParking
          selectedList = {selectedParking}
          parkings = {parking}
          literals = {props.literals}

          back = {()=>setShowParkings(false)}
          seletecPlate = {(e)=>{setSelectedParking(e)}}
          
          Countdown = {<Countdown eventTime={moment(selectedParking?.to).unix()} interval={1000} />}
        />
      </Drawer>
      <Spinner
          spinner = {showSpinner}
      />
    </>
  );
};
