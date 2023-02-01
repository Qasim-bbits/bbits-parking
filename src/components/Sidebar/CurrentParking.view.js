import React from 'react';
import Box from "@mui/material/Box";
import {Button, IconButton, Typography, useMediaQuery, Divider, useTheme} from "@mui/material";
import { ArrowBack } from '@mui/icons-material';
import moment from 'moment';
import List from "../Icons/List"
import Location from "../Icons/Location"
import ParkIn from "../Icons/ParkIn"
import ParkOut from "../Icons/ParkOut"
import Plate from "../Icons/Plate"
import Rate from "../Icons/Rate"
import Amount from '../Icons/Amount';
import Clock from '../Icons/Clock';
import Percantage from '../Icons/Percantage';

const iconStyle = {width: '25px', marginRight: '7px',  marginLeft: '7px'}
function CurrentParking(props) {
  const theme = useTheme();
  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'), {
    defaultMatches: true,
    noSsr: false
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: smDown ? '100%' : 600,
      backgroundColor: '#fff',
      // height: '100%'
    }}>
      <Box sx={{display: 'flex', backgroundColor: 'primary.main', width: '100%'}}>
        <IconButton
          color="inherit"
          align={"right"}
          onClick={props.back}
        >
          <ArrowBack />
        </IconButton>
      </Box>
      <Box sx={{display: 'flex', width: '90%', marginTop: 1, justifyContent: 'center', alignItems: 'flex-end', color: 'black', overflow: 'auto'}}>
        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {props.parkings.map((x,index)=>{
              return(
                <Button 
                  size="small" 
                  variant={(x.parking_id === props.selectedList?.parking_id) ? 'outlined': ''} 
                  onClick={()=> props.seletecPlate(x)}>
                    {x.plate}
                </Button>
              )
            })}
          </Box>
        </Typography>
      </Box>
      <Divider sx={{width: '90%', mt: 1}}/>
      <Box sx={{display: 'flex', width: '90%', marginTop: 1, justifyContent: 'space-between', alignItems: 'center', color: 'black', mt: 2}}>
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
            {props.selectedList?.parking_id}
          </Box>
        </Typography>
      </Box>
      <Box sx={{textAlign: '-webkit-center', width: '100%'}}>
        <Box sx={{display: 'flex', width: '90%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
            <Box>
              <ParkIn color={theme.palette.primary.main} width={'46'}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {moment(props.selectedList?.from).format('ll')}
            </Box>
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
              {moment(props.selectedList?.from).format('hh:mm a')}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box>
                <Clock color={theme.palette.primary.main}/>
              </Box>
            </Box>
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
              {props.Countdown}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
            <Box>
              <ParkOut color={theme.palette.primary.main}/>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {moment(props.selectedList?.to).format('ll')}
            </Box>
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
              {moment(props.selectedList?.to).format('hh:mm a')}
            </Box>
          </Typography>
        </Box>
        <Divider sx={{width: '90%', mt:2}}/>
        <Box sx={{display: 'flex', width: '90%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={iconStyle}>
                <Location color={theme.palette.primary.main}/>
              </Box>
              {props.selectedList?.zone?.zone_name}, {props.selectedList?.city?.city_name}
            </Box>
          </Typography>
        </Box>
        <Divider sx={{width: '90%'}}/>
        <Box sx={{display: 'flex', width: '90%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={iconStyle}>
                <Plate color={theme.palette.primary.main}/>
              </Box>
              {props.selectedList?.plate}
            </Box>
          </Typography>
        </Box>
        <Divider sx={{width: '90%'}}/>
        <Box sx={{display: 'flex', width: '90%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={iconStyle}>
                <Rate color={theme.palette.primary.main}/>
              </Box>
              {props.selectedList?.rate?.rate_name}
            </Box>
          </Typography>
        </Box>
        <Divider sx={{width: '90%'}}/>
        <Box sx={{display: 'flex', width: '90%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={iconStyle}>
                <Percantage color={theme.palette.primary.main}/>
              </Box>
              {props.literals.service_fee}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', alignSelf: 'center'}} >
            <Box>
              {(props.selectedList?.service_fee/100).toFixed(2)} $
            </Box>
          </Typography>
        </Box>
        <Divider sx={{width: '90%', mb: 2}}/>
        <Box sx={{display: 'flex', width: '90%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
              <Box sx={iconStyle}>
                <Amount color={theme.palette.primary.main}/>
              </Box>
              {props.literals.amount_paid}
            </Box>
          </Typography>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', alignSelf: 'center'}} >
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {(props.selectedList.amount/100).toFixed(2)} $
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CurrentParking;