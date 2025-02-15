import React from 'react';
import Box from "@mui/material/Box";
import {Card, Grid, Typography, useTheme} from "@mui/material";
import EnterParking from "../../../assets/icons/enter_parking.png";
import ExitParking from "../../../assets/icons/exit_parking.png";
import { PinDropOutlined } from '@mui/icons-material';

export default function ParkingManagement(props) {
  const theme = useTheme();
  return (
    <Grid
            container
            spacing={0}
            style={{background: '#eee' }}
        >
            <Grid item xs={12} sx={{ height: 'calc(100vh - 115px)' }}>
                <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3} sx={{ placeContent: "center", flex: '0 0 auto' }}>
                        <Grid item xs={12}>
                            <Typography variant='h5' align='center' sx={{fontWeight: 'bold'}} >
                                {props.literals.parking_management}
                            </Typography>
                        </Grid>
                        <Grid item md={8} xs={12} textAlign="center">
                            <Grid container spacing={3}>
                                <Grid item xs={6} textAlign="center" onClick={props.showPlateConfirmation}>
                                    <Box
                                        sx={{cursor: 'pointer', pointerEvents: props.zone.available_passes == 0 ? 'none' : '', width: {
                                            xs: '90%',
                                            sm: '40%'
                                          },}}
                                        component="img"
                                        alt=""
                                        src={EnterParking}
                                        />
                                    <Typography variant='subtitle2' align='center' sx={{fontWeight: 'bold', background: '#1a99d5', color: 'white', width: 'fit-content', justifySelf: 'center', padding: '6px 15px', borderRadius: '30px'}} >
                                        ENTER PARKING
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} textAlign="center" onClick={props.endSession}>
                                    <Box
                                        sx={{cursor: 'pointer', width: {
                                            xs: '90%',
                                            sm: '40%'
                                          }}}
                                        component="img"
                                        alt=""
                                        src={ExitParking}
                                        />
                                    <Typography variant='subtitle2' align='center' sx={{fontWeight: 'bold', background: '#d54343', color: 'white', width: 'fit-content', justifySelf: 'center', padding: '6px 15px', borderRadius: '30px'}} >
                                        EXIT PARKING
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ placeContent: "end", alignContent: 'end', flex: '1 1 auto' }}>
                        <Grid item xs={12} textAlign={'end'}>
                            <Typography variant= 'caption' sx={{background: '#e2dede', width: 'fit-content', justifySelf: 'end', padding: '8px 15px', borderRadius: '5px'}}>
                                <PinDropOutlined/> {props.literals.space_available} {props.zone.available_passes}
                            </Typography>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
  );
}