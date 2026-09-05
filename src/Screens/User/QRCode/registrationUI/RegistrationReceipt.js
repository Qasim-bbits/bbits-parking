import React from 'react';
import Box from "@mui/material/Box";
import {Button, IconButton, Typography, useMediaQuery, Divider, useTheme} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from 'moment';
import List from "../../../../components/Icons/List";
import Location from "../../../../components/Icons/Location"
import ParkIn from "../../../../components/Icons/ParkIn"
import ParkOut from "../../../../components/Icons/ParkOut"
import Plate from "../../../../components/Icons/Plate"
import Rate from "../../../../components/Icons/Rate"
import Amount from '../../../../components/Icons/Amount';
import Clock from '../../../../components/Icons/Clock';
import Percantage from '../../../../components/Icons/Percantage';
import PDFDownloader from '../../../../components/PDFDownloader/PDFDownloader';
import { DirectionsCar, EmailOutlined, PeopleAltOutlined, LocationOn, LocalPhone, Brightness5, Paid } from '@mui/icons-material';

const iconStyle = {width: '25px', marginRight: '7px'}

function RegistrationReceipt(props) {
  const theme = useTheme();
  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'), {
    defaultMatches: true,
    noSsr: false
  });
  const timezone = props.zone?.city_id?.time_zone || "America/New_York";
  
  return (
    <div id="receipt" style={{width: '100%', textAlign: '-webkit-center'}}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: '#fff',
        // height: '100%'
      }}>
        <Box sx={{display: 'flex', backgroundColor: theme.palette.primary.main, width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
          <IconButton
            color="inherit"
            edge="end"
            onClick={()=>window.location.reload()}
          >
            <ArrowBackIcon />
          </IconButton>
          <PDFDownloader
            downloadFileName={"receipt_"+moment().format("ll")}
            rootElementId="receipt"
          />
        </Box>
        <Divider sx={{width: '80%', mt:2}}/>
        <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'center', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
              <Box sx={iconStyle}>
                <List color={theme.palette.primary.main}/>
              </Box>
              {props.literals.parking_id}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {props.parking.parking_id}
            </Box>
          </Typography>
        </Box>
        <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'center', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
            <Box>
              <ParkIn color={theme.palette.primary.main} width={'46'}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {moment(props.parking.from).tz(timezone).locale(props.selectedLanguage).format('ll')}
            </Box>
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
              {moment(props.parking.from).tz(timezone).locale(props.selectedLanguage).format('hh:mm a')}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', display: { xs: 'none', md: 'block' }}} >
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', justifyContent: 'center',  display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box>
                <Clock color={theme.palette.primary.main}/>
              </Box>
              <Box sx={{ }}>
                <Typography variant='caption' align='left' sx={{color: 'primary.main'}} >
                  {props.literals.duration}
                </Typography>
                <Typography variant='body1' align='left' sx={{color: 'primary.main', fontWeight: 'bold'}} >
                  {moment(props.parking.to).tz(timezone).diff(moment(props.parking.from), "days")+1} {props.literals.nights}
                </Typography>
              </Box>
            </Box>

          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
            <Box>
              <ParkOut color={theme.palette.primary.main}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {moment(props.parking.to).tz(timezone).locale(props.selectedLanguage).format('ll')}
            </Box>
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
              {moment(props.parking.to).tz(timezone).locale(props.selectedLanguage).format('hh:mm a')}
            </Box>
          </Typography>
        </Box>
        <Divider sx={{width: '80%', mt:2}}/>
        <Box sx={{display: 'flex', width: '80%', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: { xs: 0.5, md: 0 }, marginTop: 1, justifyContent: 'space-between', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <Box sx={iconStyle}>
                <LocationOn color={theme.palette.primary.main}/>
              </Box>
              {props.literals.location}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', ml: { xs: '32px', md: 0 }}} >
            {props.zone.zone_name}, {props.zone.city_id.city_name}
          </Typography>
        </Box>
        <Divider sx={{width: '80%', mt:2}}/>
        <Box sx={{display: 'flex', width: '80%', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: { xs: 0.5, md: 0 }, marginTop: 1, justifyContent: 'space-between', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <Box sx={iconStyle}>
                <PeopleAltOutlined color={theme.palette.primary.main}/>
              </Box>
              {props.literals.guest_name}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', ml: { xs: '32px', md: 0 }}} >
            {props.parking.full_name}
          </Typography>
        </Box>
        <Divider sx={{width: '80%', mt:2}}/>
        <Box sx={{display: 'flex', width: '80%', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: { xs: 0.5, md: 0 }, marginTop: 1, justifyContent: 'space-between', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <Box sx={iconStyle}>
                <DirectionsCar color={theme.palette.primary.main}/>
              </Box>
              {props.literals.license_plate}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', ml: { xs: '32px', md: 0 }}} >
            {props.parking.plate}
          </Typography>
        </Box><Divider sx={{width: '80%', mt:2}}/>
        <Box sx={{display: 'flex', width: '80%', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: { xs: 0.5, md: 0 }, marginTop: 1, justifyContent: 'space-between', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <Box sx={iconStyle}>
                <EmailOutlined color={theme.palette.primary.main}/>
              </Box>
              {props.literals.email}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', ml: { xs: '32px', md: 0 }}} >
            {props.parking.email}
          </Typography>
        </Box>
        <Divider sx={{width: '80%', mt:2}}/>
        <Box sx={{display: 'flex', width: '80%', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, gap: { xs: 0.5, md: 0 }, marginTop: 1, justifyContent: 'space-between', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <Box sx={iconStyle}>
                <LocalPhone color={theme.palette.primary.main}/>
              </Box>
              {props.literals.phone_no}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', ml: { xs: '32px', md: 0 }}} >
            {props.parking.mobile_no}
          </Typography>
        </Box>
        <Divider sx={{width: '80%', mt:2}}/>
        <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <Box sx={iconStyle}>
                <Brightness5 color={theme.palette.primary.main}/>
              </Box>
              {props.literals.service_fee}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', alignSelf: 'center'}} >
            <Box>
              {(props.parking.service_fee/100).toFixed(2)} $
            </Box>
          </Typography>
        </Box>
        <Divider sx={{width: '80%', mb: 2}}/>
        <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
              <Box sx={iconStyle}>
                <Paid color={theme.palette.primary.main}/>
              </Box>
              {props.literals.amount_paid}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', alignSelf: 'center'}} >
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {(props.parking.amount/100).toFixed(2)} $
            </Box>
          </Typography>
        </Box>
        <Divider sx={{width: '80%', mb: 2}}/>
        <Box sx={{display: 'flex', width: '80%', marginTop: 1, alignItems: 'center'}}>
          <Button
            type="button"
            color="primary"
            variant="contained"
            size="medium"
            fullWidth
            onClick={()=>props.emailReciept()}
          >
            {props.literals.send_by_email_optional}
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default RegistrationReceipt;