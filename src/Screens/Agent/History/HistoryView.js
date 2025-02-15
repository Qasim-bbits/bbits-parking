import React from 'react';
import { Divider, Typography, useTheme, Card, TextField, Button, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import moment from 'moment';

export default function HistoryView(props) {
    let theme = useTheme();

    return (
        <Grid
            container
            spacing={0}
            style={{ minHeight: 'calc(100vh - 63.98px)', background: '#eee', placeContent: 'center' }}
        >
            <Grid item md={7} sm={11} xs={12} sx={{ height: 'calc(100vh - 63.98px)' }}>
                <Card sx={{ pt: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Grid container sx={{ placeContent: "center", flex: '0 0 auto' }}>
                        <Grid item xs={12}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', px: 2 }}>{props.literals.history}</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 2 }}>
                            <Divider />
                        </Grid>
                        <Grid container spacing={2} component={'form'} onSubmit={props.onSearch} sx={{p: 2}}>
                        <Grid item sm={5} xs={6}>
                            <TextField
                                label={props.literals?.start_date}
                                variant="outlined"
                                type="date"
                                name="start_date"
                                value={props.inputField["start_date"]}
                                onChange={props.handleChange}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ max: moment().format("YYYY-MM-DD") }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item sm={5} xs={6}>
                            <TextField
                                label={props.literals?.end_date}
                                variant="outlined"
                                type="date"
                                name="end_date"
                                value={props.inputField["end_date"]}
                                onChange={props.handleChange}
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ min: props.inputField.start_date, max: moment().format("YYYY-MM-DD") }}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item sm={2} xs={12} textAlign={'end'} alignSelf={'center'}>
                            <Button
                                type="submit"
                                color="primary"
                                variant="contained"
                                size="small">
                                {props.literals.search}
                            </Button>
                        </Grid>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ flex: 1, overflow: 'auto', p: 2, mt: 0 }}>
                        {props.history.map(x => {
                            return (
                                <Grid item xs={12}>
                                    <Paper elevation={3}
                                        sx={{
                                            p: 2,
                                        }}>
                                        <Grid container spacing={1}>
                                            <Grid item xs={12} textAlign={'end'}>
                                                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                                                    {moment(x.issued_at).format('MMMM Do YYYY, hh:mm a')}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="body" color="primary" sx={{ fontWeight: 'bold' }}>{x.ticket_num}</Typography><br/>
                                                <Typography variant="body" sx={{ fontWeight: 'bold' }}>{x.plate}</Typography>
                                            </Grid>
                                            <Grid item xs={6} textAlign={'end'} alignSelf={'center'}>
                                                <Typography variant="subtitle1" sx={{
                                                    fontWeight: 'bold',
                                                    color: x.ticket_status == 'unpaid' ? 'red' : 'green',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    {x.ticket_status}
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption">{x.zone.zone_name}, {x.city.city_name}</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Typography variant="caption">{x.ticket.ticket_name}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            )
                        })}
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}