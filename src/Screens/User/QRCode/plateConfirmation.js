import React from 'react';
import { Button, Card, Grid, IconButton, TextField, Typography, useTheme } from "@mui/material";
import { ArrowBack, PinDropOutlined } from '@mui/icons-material';

export default function PlateConfirmation(props) {
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
                <Card component={'form'} onSubmit={props.handlePlateSubmit} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3} sx={{placeContent: 'center', flex: '0 0 auto' }}>
                        <Grid item xs={12}>
                            <Typography variant='h5' align='center' sx={{ fontWeight: 'bold' }} >
                                {props.literals.plate_confirmation}
                            </Typography>
                        </Grid>
                        <Grid item md={8} xs={12} textAlign="center">
                            <TextField
                                id="standard-error-helper-text"
                                label={props.literals.plate_no}
                                type="text"
                                color='primary'
                                size="small"
                                name="plate"
                                value={props.inputPlateField["plate"]}
                                onChange={props.handlePlateChange}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item md={8} xs={12} textAlign="center">
                            <Button type="submit" variant="contained" color="primary">
                                {props.literals.confirm}
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ placeContent: "end", alignContent: 'end', flex: '1 1 auto' }}>
                        <Grid item xs={12} textAlign={'end'}>
                            <Typography variant='caption' sx={{ background: '#e2dede', width: 'fit-content', justifySelf: 'end', padding: '8px 15px', borderRadius: '5px' }}>
                                <PinDropOutlined /> {props.literals.space_available} {props.zone.available_passes}
                            </Typography>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}