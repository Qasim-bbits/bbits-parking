import React from 'react';
import { Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Business, ConfirmationNumberOutlined, DirectionsCar, LocationOnOutlined, Loop, MessageOutlined, PinDropOutlined, Tag } from '@mui/icons-material';

export default function SummaryView(props) {
    
    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <Tag color="primary" />
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>{props.inputField.ticket_num_next}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <DirectionsCar color="primary" />
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>{props.inputField.plate}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            {props.inputField?.images?.length && <Grid item xs={12} textAlign={'end'}>
                {props.inputField?.images?.map((x) => {
                    return(
                        <img src={x} alt="screenshot" width={50} height={50} style={{marginLeft: '5px'}} />
                    )
                })}
            </Grid>}
            {props.inputField?.images?.length && <Grid item xs={12}>
                <Divider />
            </Grid>}
            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <Business color="primary" />
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1">{props.inputField.org_name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <LocationOnOutlined color="primary" />
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1">{props.inputField.city_name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <PinDropOutlined color="primary" />
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1">{props.inputField.zone_name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <ConfirmationNumberOutlined color="primary" />
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1">{props.inputField.ticket_name}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            {props.inputField?.message_after_paid && <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <MessageOutlined color="primary" />
            </Grid>}
            {props.inputField?.message_after_paid && <Grid item xs={10}>
                <Typography variant="subtitle1">{props.inputField.message_after_paid}</Typography>
            </Grid>}
            {props.inputField?.message_after_paid && <Grid item xs={12}>
                <Divider />
            </Grid>}
            <Grid item xs={12}>
                {props.aging.map((x, index) => {
                    return (
                        <Grid container spacing={3}>
                            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                                {index == 0 && <Loop color="primary"/>}
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                    $ {(x.rate / 100).toFixed(2)} {(x.applied_from == 0) ? props.literals.within + ' ' + (x.applied_to / 24 / 60) + ' ' + props.literals.days :
                                        (x.applied_to == null) ? props.literals.after + ' ' + (x.applied_from / 24 / 60 + ' ' + props.literals.days) :
                                            props.literals.within + ' ' + (x.applied_from / 24 / 60) + ' ' + props.literals.to + ' ' + (x.applied_to / 24 / 60) + ' ' + props.literals.days}
                                </Typography>
                            </Grid>
                        </Grid>
                    )
                })}
            </Grid>
        </Grid>
    );
}