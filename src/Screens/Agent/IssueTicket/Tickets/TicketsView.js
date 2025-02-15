import React, { useState } from 'react';
import { Divider, List, ListItem, ListItemText, ListItemButton, TextField, Typography, ListItemIcon, useTheme, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Done } from '@mui/icons-material';

export default function TicketsView(props) {
    let theme = useTheme();
    const [ticketType, setTicketType] = useState('normal');

    const onTicketType = (e) => {
        setTicketType(e.target.value);
    }

    return (
        <Grid container>
            <Grid item xs={12} sx={{ p: 2 }}>
                <TextField
                    label={props.literals?.search_ticket}
                    variant="outlined"
                    type="text"
                    onChange={props.handleSearch}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} sx={{ p: 2 }}>
                <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                >
                    <FormControlLabel value="normal" sx={{ color: "#2c3680" }} control={
                        <Radio
                            checked={ticketType == 'normal'}
                            onChange={onTicketType}
                            required
                        />} label={props.literals.normal} />
                    <FormControlLabel value="booting" sx={{ color: "#2c3680" }} control={
                        <Radio
                            checked={ticketType == 'booting'}
                            onChange={onTicketType}
                            required
                        />} label={props.literals.booting} />
                </RadioGroup>
            </Grid>
            {ticketType == 'booting' &&
                <Grid item xs={12} sx={{ p: 2 }}>
                    <TextField
                        label={props.literals?.message_after_paid}
                        variant="outlined"
                        type="text"
                        onChange={(e) => props.onChange({ message_after_paid: e.target.value })}
                        fullWidth
                    />
                </Grid>
            }
            <Grid item xs={12}>
                {!props.tickets.length &&
                    <Typography variant="subtitle1" color="secondary" sx={{ textAlign: 'center' }}>{props.literals.no_record_found}</Typography>
                }
                <List>
                    {ticketType == 'normal' && props.tickets.filter(y => y.ticket_type != 'booting').map(x => {
                        return (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ color: props.inputField.ticket == x._id && theme.palette.primary.main }} onClick={() => props.onChange({ ticket: x._id, ticket_name: x.ticket_name, ticket_num_next: x.ticket_num_next })}>
                                        {props.inputField.ticket == x._id && <ListItemIcon>
                                            <Done color="primary" />
                                        </ListItemIcon>}
                                        <ListItemText primary={x.ticket_name} />
                                    </ListItemButton>

                                </ListItem>
                                <Divider />
                            </>
                        )
                    })
                    }
                    {ticketType == 'booting' && props.tickets.filter(y => y.ticket_type == 'booting').map(x => {
                        return (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ color: props.inputField.ticket == x._id && theme.palette.primary.main }} onClick={() => props.onChange({ ticket: x._id, ticket_name: x.ticket_name, ticket_num_next: x.ticket_num_next })}>
                                        {props.inputField.ticket == x._id && <ListItemIcon>
                                            <Done color="primary" />
                                        </ListItemIcon>}
                                        <ListItemText primary={x.ticket_name} />
                                    </ListItemButton>

                                </ListItem>
                                <Divider />
                            </>
                        )
                    })
                    }
                </List>
            </Grid>
        </Grid>
    );
}