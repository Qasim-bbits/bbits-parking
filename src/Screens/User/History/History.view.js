import React from 'react';
import Box from "@mui/material/Box";
import {Button, IconButton, Typography, useTheme} from "@mui/material";
import moment from 'moment';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import ParkIn from '../../../components/Icons/ParkIn';
import Clock from '../../../components/Icons/Clock';
import ParkOut from '../../../components/Icons/ParkOut';
import Plate from '../../../components/Icons/Plate';

function HistoryView(props) {
  const theme = useTheme();
  const parkingRateButton = {
    backgroundColor: '#f0f2f5',
    margin: 5,
    color: '#2c3680',
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      backgroundColor: '#fff',
      height: '100%'
    }}>
      <Box sx={{display: 'flex', width: '80%', justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
        <Typography variant='h5' align='left' sx={{marginTop: 5, color: 'primary.main'}} >
          <IconButton
            color="inherit"
            edge="start"
          >
            <LocalParkingIcon />
          </IconButton>
          {props.literals.parking_history}
        </Typography>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '2%', padding: '0 8% 0 8%', width: '100%'}}>
        {props.history.map(x=>{
          return(
            <Button variant='contained' onClick={()=>props.onListSelect(x)} style={parkingRateButton} fullWidth sx={{justifyContent: 'flex-start'}}>
                <Box sx={{display: 'flex', width: '100%', marginTop: 1, justifyContent: 'space-between', alignItems: 'center', color: 'black'}}>
                    <Typography variant='caption' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
                        <Box>
                          <ParkIn color={theme.palette.primary.main} width={'46'}/>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {moment(x.from).format('ll')}
                        </Box>
                        <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
                            {moment(x.from).format('hh:mm a')}
                        </Box>
                    </Typography>
                    <Typography variant='caption' align='left' sx={{color: 'primary.main'}} >
                        <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center'}}>
                          <Box>
                            <Plate color={theme.palette.primary.main}/>
                          </Box>
                        </Box>
                        <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
                          {x.plate}
                        </Box>
                    </Typography>
                    <Typography variant='caption' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
                        <Box>
                          <ParkOut color={theme.palette.primary.main}/>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {moment(x.to).format('ll')}
                        </Box>
                        <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
                            {moment(x.to).format('hh:mm a')}
                        </Box>
                    </Typography>
                </Box>
            </Button>
          )
        })}
      </Box>
    </Box>
  );
}

export default HistoryView;