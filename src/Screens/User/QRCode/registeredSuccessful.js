import React from 'react';
import {Button, Card, Grid, IconButton, Typography, useTheme} from "@mui/material";
import { ArrowBack, PinDropOutlined } from '@mui/icons-material';

export default function RegisteredSuccessful(props) {
  const theme = useTheme();
  return (
    <Grid
            container
            spacing={0}
        >
            <IconButton
            sx={{ marginLeft: '20px', position: 'absolute', left: 'unset', top: '12px', zIndex: 10000, color: 'white', background: theme.palette.primary.main }}
            edge="end"
            onClick={props.back}
        >
            <ArrowBack />
        </IconButton>
            <Grid item xs={12} sx={{ height: 'calc(100vh - 115px)' }}>
                <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3} sx={{placeContent: 'center', flex: '0 0 auto' }}>
                        <Grid item xs={12}>
                            <Typography variant='h5' align='center' sx={{fontWeight: 'bold'}} >
                                {props.literals.registration_successful}
                            </Typography>
                        </Grid>
                        <Grid item md={8} xs={12} textAlign="center">
                            <Typography variant='body2' align='center' sx={{fontWeight: 'bold'}} >
                                {props.literals.plate_registered_successfully}
                            </Typography>
                        </Grid>
                        <Grid item md={8} xs={12} textAlign="center">
                            <Button type="button" variant="contained" color="primary" onClick={props.continue}>
                                {props.literals.continue}
                            </Button>
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