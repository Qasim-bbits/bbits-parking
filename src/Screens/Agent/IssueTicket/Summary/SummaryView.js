import React, { useEffect } from 'react';
import { Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Business, ConfirmationNumberOutlined, DirectionsCar, LocationOnOutlined, Loop, MessageOutlined, NotesOutlined, PinDropOutlined, Tag } from '@mui/icons-material';
import helpers from '../../../../Helpers/Helpers';
import moment from 'moment';
import { config } from '../../../../Constants';

export default function SummaryView(props) {
    useEffect(() => {
        let agingSection = '';
        props.aging.map((x, index) => {
            if (x.applied_from == 0) {
                agingSection += `^FT120,${500 + index * 50}^A0N,24,18^FH^FD${props.literals.within} ${(x.applied_to / 24 / 60)} ${props.literals.days}:^FS
            ^FT410,${500 + index * 50}^A0N,40,32^FH^FD$ ${(x.rate / 100).toFixed(2)}^FS`;
            } else if (x.applied_to == null) {
                agingSection += `^FT120,${500 + index * 50}^A0N,24,18^FH^FD${props.literals.after} ${(x.applied_from / 24 / 60)} ${props.literals.days}:^FS
            ^FT410,${500 + index * 50}^A0N,40,32^FH^FD$ ${(x.rate / 100).toFixed(2)}^FS`;
            } else {
                agingSection += `^FT120,${500 + index * 50}^A0N,24,18^FH^FD$${props.literals.within} ${(x.applied_from / 24 / 60)} ${props.literals.to} ${(x.applied_to / 24 / 60)} ${props.literals.days}:^FS
            ^FT410,${500 + index * 50}^A0N,40,32^FH^FD$ ${(x.rate / 100).toFixed(2)}^FS`;
            }
        });
        props.setTicketIssued(
            {
                ...props.inputField,
                agingSection: agingSection,
                agentId: JSON.parse(sessionStorage.getItem('userLogged')).result?._id,
                payTicketUrl: config.url.http + config.url.client_url + 'pay_ticket',
                amount: props.aging && props.aging.length ? `$ ${(props.aging[0].rate / 100).toFixed(2)}` : '$ 0.00',
            });
    }, [props.aging])

    return (
        <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <Tag color="primary" />
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{props.inputField.ticket_num_next}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                <DirectionsCar color="primary" />
            </Grid>
            <Grid item xs={10}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{props.inputField.plate}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Divider />
            </Grid>
            {props.inputField?.images?.length && <Grid item xs={12} textAlign={'end'}>
                {props.inputField?.images?.map((x) => {
                    return (
                        <img src={x} alt="screenshot" width={50} height={50} style={{ marginLeft: '5px' }} />
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
                                {index == 0 && <Loop color="primary" />}
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
            {props.inputField.public_note && <>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                    <NotesOutlined color="primary" />
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="subtitle1">{props.inputField.public_note}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography color="primary" variant="caption" sx={{fontStyle: "italic"}}>{props.literals.public_note}</Typography>
                </Grid>
            </>}
            {props.inputField.private_note && <>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={2} textAlign={'center'} alignItems={'center'}>
                    <NotesOutlined color="primary" />
                </Grid>
                <Grid item xs={8}>
                    <Typography variant="subtitle1">{props.inputField.private_note}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography color="primary" variant="caption" sx={{fontStyle: "italic"}}>{props.literals.private_note}</Typography>
                </Grid>
            </>}
        </Grid>
    );
}