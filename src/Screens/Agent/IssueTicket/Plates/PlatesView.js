import React from 'react';
import { Button, IconButton, InputAdornment, Paper, TextField, Typography, lighten, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Close } from '@mui/icons-material';
const moment = require('moment-timezone');

export default function PlatesView(props) {
    moment.tz.setDefault(moment.tz.guess());

    let theme = useTheme();

    const getPlateStatusColor = (item) => {
        if (moment().toDate() >= moment(item.from).toDate() && moment().toDate() <= moment(item.to).toDate() && item.zone?._id) {
            if(item.status)
                return {
                    color: 'orange',
                    status: 'Shared Violation'
                }
            else
                return {
                    color: item.zone?._id == props.inputField.zone ? 'green' : 'orange',
                    status: item.zone?._id == props.inputField.zone ? 'Paid' : 'Paid in another zone'
                }
        } else if (item.zone?._id) {
            return {
                color: 'red',
                status: 'Expired'
            }
        } else {
            return {
                color: 'red',
                status: 'Not Paid'
            }
        }
    }

    return (
        <Grid container>
            <Grid item xs={12} sx={{ p: 2, display: 'flex' }}>
                <TextField
                    label={props.literals?.search_plate}
                    variant="outlined"
                    type="text"
                    onChange={props.handleSearch}
                    fullWidth
                />
                {/* <Button
                    sx={{ height: '100%', ml: 2 }}
                    onClick={() => props.handleSearch()}
                    type="button"
                    variant="contained"
                    color="primary"
                    disabled={!props.inputField.plate}
                >
                    {props.literals.scan}
                </Button> */}
            </Grid>
            <Grid item xs={12}>
                {!props.plates.length &&
                    <Typography variant="subtitle1" color="secondary" sx={{ textAlign: 'center' }}>{props.literals.no_record_found}</Typography>
                }
                <Grid container spacing={2} sx={{ p: 2 }}>
                    {props.plates.map(x => {
                        return (
                            <>
                                <Grid item md={4} sm={6} xs={12} textAlign={'center'}>
                                    <Paper elevation={3}
                                        sx={{
                                            p: 2,
                                            cursor: 'pointer',
                                            background: x.plate == props.inputField.plate && lighten(theme.palette.primary.main, 0.25)
                                        }}
                                        onClick={
                                            () => { props.handlePlateSelect({ plate: x.plate }) }
                                        }>
                                        <Typography variant="body" sx={{ fontWeight: 'bold' }}>{x.plate}</Typography>
                                        {getPlateStatusColor(x).status !== 'Not Paid' && !x.checked_status &&
                                            <Typography sx={{pt:2}}>
                                                <Button
                                                    onClick={() => props.checkStatus(x)}
                                                    type="button"
                                                    variant="outlined"
                                                    color="primary"
                                                >
                                                    {props.literals.check_status}
                                                </Button>
                                            </Typography>}
                                        {x.checked_status && <Typography variant="subtitle1" sx={{ pt:2, fontWeight: 'bold', color: x.checked_status == 'Paid' ? 'green' : 'orange' }}>
                                            {x.checked_status}
                                        </Typography>}
                                        {getPlateStatusColor(x).status == 'Not Paid' && <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: getPlateStatusColor(x).color }}>
                                            {getPlateStatusColor(x).status}
                                        </Typography>}
                                        {x.from && <>
                                            <Typography variant="caption">
                                                {x.zone?.zone_name}
                                            </Typography>
                                            <br />
                                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                                From: {moment(x.from).format('MMMM Do YYYY, hh:mm a')}
                                            </Typography>
                                            <br />
                                            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                                                To: {moment(x.to).format('MMMM Do YYYY, hh:mm a')}
                                            </Typography>
                                        </>}
                                    </Paper>
                                </Grid>
                            </>
                        )
                    })
                    }
                </Grid>

            </Grid>
        </Grid>
    );
}