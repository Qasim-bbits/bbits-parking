import React, { useState } from 'react';
import { Divider, List, ListItem, ListItemText, ListItemButton, IconButton, Button, TextField, Typography, ListItemIcon, useTheme, RadioGroup, FormControlLabel, Radio, TableCell, TableRow, TableBody, TableHead, Drawer, Box, Table, ImageList, ImageListItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Done, Close } from '@mui/icons-material';
import moment from 'moment-timezone';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const customStyles = {
  overlay: {
    zIndex: 1200
  },
};

export default function TicketsView(props) {
    let theme = useTheme();
    const [ticketType, setTicketType] = useState('normal');
    const [ticketIssuedDrawer, setTicketIssuedDrawer] = useState(false);
    const [ticketViewDrawer, setTicketViewDrawer] = useState(false);
    const [ticketDetail, setTicketDetail] = useState({});
    const [photoIndex, setPhotoIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    const onTicketType = (e) => {
        setTicketType(e.target.value);
    }

    return (
        <Grid container>
            <Grid item xs={12} sx={{ p: 2 }}>
                {props.issuedTickets?.length > 0 && (
                    <Typography
                        variant="body2"
                        sx={{ textAlign: "center", color: "warning.main", mb: 1 }}
                    >
                        This plate already has tickets —{" "}
                        <Typography
                            component="span"
                            sx={{ cursor: "pointer", color: "primary.main", fontWeight: 600 }}
                            onClick={() => setTicketIssuedDrawer(true)}
                        >
                            View all
                        </Typography>
                    </Typography>
                )}
            </Grid>
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
            <Drawer anchor="right" open={ticketIssuedDrawer} onClose={() => setTicketIssuedDrawer(false)}>
                <Box
                    sx={{
                        width: { xs: '100vw', sm: '100vw', md: 600, lg: 720 },
                        maxWidth: 720,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh' // full drawer height
                    }}
                >
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: theme.palette.warning.main }}>
                            Issued Tickets
                        </Typography>
                        <IconButton onClick={() => setTicketIssuedDrawer(false)}>
                            <Close />
                        </IconButton>
                    </Box>

                    {/* Table container with scroll */}
                    <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{fontWeight: 'bold'}}>Ticket</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}}>Date</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}}>Location</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}}>Infraction</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}}>Amount</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}}>Status</TableCell>
                                    <TableCell sx={{fontWeight: 'bold'}}>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.issuedTickets?.map((t, i) => (
                                    <TableRow key={i}>
                                        <TableCell>{t.ticketIssued?.ticket_num}</TableCell>
                                        <TableCell>
                                            {moment(t?.ticketIssued?.issued_at)
                                                .tz(t?.ticketIssued?.city.time_zone || 'America/New_York')
                                                .format('MMM Do YY, hh:mm a')}
                                        </TableCell>
                                        <TableCell>
                                            {t.ticketIssued?.zone?.zone_name}, {t.ticketIssued?.city?.city_name}
                                        </TableCell>
                                        <TableCell>{t.ticketIssued?.ticket?.ticket_name}</TableCell>
                                        <TableCell>$ {(t?.ticketAmount?.rate / 100).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                color={(t.ticketIssued?.ticket_status == 'paid') ? "success" : (t.ticketIssued?.ticket_status == 'unpaid') ? "error" : "secondary"}
                                                size="small"
                                                sx={{ px: 2, borderRadius: '20px', fontSize: '12px' }}
                                            >
                                                {props.literals[t.ticketIssued?.ticket_status]}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Typography
                                                component="span"
                                                sx={{ cursor: "pointer", color: "primary.main", fontWeight: 600 }}
                                                onClick={() => { setTicketViewDrawer(true); setTicketDetail(t) }}
                                            >
                                                View
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Box>
                </Box>
            </Drawer>
            <Drawer anchor="right" open={ticketViewDrawer} onClose={() => setTicketViewDrawer(false)}>
                <Box sx={{
                        width: { xs: '100vw', sm: '100vw', md: 600, lg: 720 },
                        maxWidth: 720,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100vh' // full drawer height
                    }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{ color: theme.palette.warning.main }}>
                            Tickets Detail
                        </Typography>

                        <IconButton onClick={() => setTicketViewDrawer(false)}>
                            <Close />
                        </IconButton>
                    </Box>

                    <Grid container spacing={1} sx={{ placeContent: "center", p: 2 }}>
                        <Grid item xs={6}>
                            <Typography variant="subtitle1" color="primary">
                                {props.literals.ticket_num}:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} align='end'>
                            <Typography variant="subtitle1" color="primary">
                                {ticketDetail?.ticketIssued?.ticket_num}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}><Divider width="100%" /></Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} alignSelf="center">
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {props.literals.images}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <ImageList sx={{ overflowX: 'auto' }}>
                                <ImageListItem sx={{ display: 'flex', flexDirection: 'row' }}>
                                    {ticketDetail?.ticketIssued?.images.map((image, index) => {
                                        return (
                                            <Button type="button" onClick={() => { setIsOpen(true); setPhotoIndex(index) }}>
                                                <img
                                                    src={image}
                                                    srcSet={image}
                                                    alt='title'
                                                    loading='lazy'
                                                    width='100px'
                                                    height='100px'
                                                    style={{ paddingRight: '1em' }}
                                                />
                                            </Button>
                                        )
                                    })}
                                </ImageListItem>
                            </ImageList>
                        </Grid>
                        <Grid item xs={12}><Divider width="100%" /></Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {props.literals.location}:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} align='end'>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {ticketDetail?.ticketIssued?.zone?.zone_name}, {ticketDetail?.ticketIssued?.city?.city_name}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}><Divider width="100%" /></Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {props.literals.plate}:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} align='end'>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {ticketDetail?.ticketIssued?.plate}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}><Divider width="100%" /></Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {props.literals.ticket_name}:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} align='end'>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {ticketDetail?.ticketIssued?.ticket?.ticket_name}
                            </Typography>
                        </Grid>
                        {ticketDetail?.ticketIssued?.public_note && <>
                            <Grid item xs={12}><Divider width="100%" /></Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                    {props.literals.public_note}:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} align='end'>
                                <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                    {ticketDetail?.ticketIssued?.public_note}
                                </Typography>
                            </Grid>
                        </>}
                        {ticketDetail?.ticketIssued?.private_note && <>
                            <Grid item xs={12}><Divider width="100%" /></Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6}>
                                <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                    {props.literals.private_note}:
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} align='end'>
                                <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                    {ticketDetail?.ticketIssued?.private_note}
                                </Typography>
                            </Grid>
                        </>}
                        {ticketDetail?.ticketIssued?.parking !== undefined &&
                            <>
                                <Grid item xs={12}><Divider width="100%" /></Grid>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                        {props.literals.parking_id}:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} align='end'>
                                    <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                        {ticketDetail?.ticketIssued?.parking?.parking_id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}><Divider width="100%" /></Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6}>
                                    <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                        {props.literals.parking} {props.literals.start_date_time} - {props.literals.end_date_time}:
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={12} md={6} lg={6} align='end'>
                                    <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                        {moment(ticketDetail?.ticketIssued?.parking?.from).tz(ticketDetail?.ticketIssued?.city.time_zone ? ticketDetail?.ticketIssued?.city.time_zone : 'America/New_York').format('MMM Do YY, hh:mm a')} - {moment(ticketDetail?.ticketIssued?.parking?.to).tz(ticketDetail?.ticketIssued?.city.time_zone ? ticketDetail?.ticketIssued?.city.time_zone : 'America/New_York').format('MMM Do YY, hh:mm a')}
                                    </Typography>
                                </Grid>
                            </>
                        }
                        <Grid item xs={12}><Divider width="100%" /></Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {props.literals.ticket} {props.literals.issued_at}:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} align='end'>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {moment(ticketDetail?.ticketIssued?.issued_at).tz(ticketDetail?.ticketIssued?.city.time_zone ? ticketDetail?.ticketIssued?.city.time_zone : 'America/New_York').format('MMM Do YY, hh:mm a')}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}><Divider width="100%" /></Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} alignSelf="center">
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {props.literals.ticket_duration}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} align='end'>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                <Table size="small" sx={{ width: 'fit-content', float: 'right' }}>
                                    {ticketDetail?.ticketAging?.map(x => {
                                        return (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{
                                                        border: 0,
                                                        color: (x._id == ticketDetail?.ticketAmount?._id) ? theme.palette.primary.main : ''
                                                    }}>
                                                        $ {(x.rate / 100).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell sx={{
                                                        border: 0,
                                                        color: (x._id == ticketDetail?.ticketAmount?._id) ? theme.palette.primary.main : ''
                                                    }}>
                                                        {(x.applied_from == 0) ? props.literals.within + ' ' + (x.applied_to / 24 / 60) + ' ' + props.literals.days :
                                                            (x.applied_to == null) ? props.literals.after + ' ' + (x.applied_from / 24 / 60 + ' ' + props.literals.days) :
                                                                props.literals.within + ' ' + (x.applied_from / 24 / 60) + ' ' + props.literals.to + ' ' + (x.applied_to / 24 / 60) + ' ' + props.literals.days}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )
                                    })}
                                </Table>
                            </Typography>
                        </Grid>
                        <Grid item xs={12}><Divider width="100%" /></Grid>
                        <Grid item xs={6} sx={{ background: '"#eeeeee52"' }}>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {props.literals.ticket_passed_days}:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} align='end' sx={{ background: '"#eeeeee52"' }}>
                            <Typography variant="subtitle2" sx={{ color: 'black' }}>
                                {ticketDetail?.ticketAmount?.day_passed} {props.literals.days}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}><Divider width="100%" /></Grid>
                        <Grid item xs={6}>
                            <Typography variant="subtitle2" color="primary">
                                {props.literals.amount}:
                            </Typography>
                        </Grid>
                        <Grid item xs={6} align='end'>
                            <Typography variant="subtitle2" color="primary">
                                $ {(ticketDetail?.ticketAmount?.rate / 100).toFixed(2)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Drawer>
            {isOpen && (
                <Lightbox
                    reactModalStyle={customStyles}
                    mainSrc={ticketDetail?.ticketIssued?.images[photoIndex]}
                    nextSrc={ticketDetail?.ticketIssued?.images[(photoIndex + 1) % ticketDetail?.ticketIssued?.images.length]}
                    prevSrc={ticketDetail?.ticketIssued?.images[(photoIndex + ticketDetail?.ticketIssued?.images.length - 1) % ticketDetail?.ticketIssued?.images.length]}
                    onCloseRequest={() => setIsOpen(false)}
                    onMovePrevRequest={() =>
                        setPhotoIndex((photoIndex + ticketDetail?.ticketIssued?.images.length - 1) % ticketDetail?.ticketIssued?.images.length)
                    }
                    onMoveNextRequest={() =>
                        setPhotoIndex((photoIndex + 1) % ticketDetail?.ticketIssued?.images.length)
                    }
                />
            )}
        </Grid>
    );
}