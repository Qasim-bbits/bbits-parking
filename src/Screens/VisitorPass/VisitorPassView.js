import React from 'react';
import { Box, Button, Card, Divider, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Typography, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { config } from '../../Constants';

export default function VisitorPassView(props) {
    const theme = useTheme();

    function timeConvert(n) {
        var num = n;
        var hours = (num / 60);
        var rhours = Math.floor(hours);
        var minutes = (hours - rhours) * 60;
        var rminutes = Math.round(minutes);
        var hr = rhours == 0 ? '' : (rhours + " HOUR(s) ");
        var min = rminutes == 0 ? '' : (rminutes + " MINUTE(s) ");
        return hr + min;
    }

    return (
        <Grid
            container
            spacing={0}
            style={{ minHeight: '100vh', background: '#eee', placeContent: 'center' }}
        >
            <Grid item md={5} sm={11} xs={12} sx={{ height: '100vh' }}>
                <Card component="form" onSubmit={props.onSubmit} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Grid container spacing={3} sx={{ placeContent: "center", flex: '0 0 auto' }}>
                        <Grid item xs={12} textAlign="center">
                            <Box
                                component="img"
                                sx={{ width: 100 }}
                                alt="logo"
                                src={config.url.file_url + props.org.logo}
                            />
                        </Grid>
                        <Grid item xs={12} textAlign={'center'}>
                            <Typography variant='body' color="primary" sx={{ fontWeight: 'bold' }}>
                                {props.rateStep.time ?
                                    ('REGISTER YOUR VEHICLE FOR '+timeConvert(props.rateStep.time)+' OF FREE PARKING') :
                                    'PARKING NOT ALLOWED DURING THESE HOURS'
                                }
                            </Typography>
                        </Grid>
                        <Grid item xs={12} textAlign={'center'}>
                            <Divider />
                        </Grid>
                        <Typography variant='body' sx={{ width: 'calc(100% + 24px)', textAlign: 'center', background: theme.palette.primary.main, color: 'white', padding: '20px 0', marginRight: '-24px' }}>
                            Zone: <Typography variant='body' sx={{ fontWeight: 'bold' }}>{props.zone.zone_name}</Typography>
                        </Typography>
                        <Grid item xs={12}>
                            <TextField
                                label={props.literals.plate}
                                color="primary"
                                type="text"
                                name="plate"
                                value={props.inputField["plate"]}
                                onChange={props.onChange}
                                size="small"
                                required
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} sx={{ flex: 1, overflow: 'auto', margin: '15px 0px' }}>
                        <Grid item xs={12}>
                            <FormControl>
                                <FormLabel sx={{ fontWeight: 'bold' }}>Parking Options</FormLabel>
                                <RadioGroup>
                                    {props.rates.map(x=>{return(
                                        <>
                                            <FormControlLabel value="female" control={
                                                <Radio
                                                    checked={x._id === props.selectedRate._id}
                                                    onChange={()=>props.onRateChange(x)}
                                                    size="small"
                                                />} label={x.rate_name} />
                                        </>
                                    )})}
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container spacing={3} sx={{ placeContent: "center", flex: '0 0 auto' }}>
                        <Grid item xs={8}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                            >
                                {props.literals.submit}
                            </Button>
                        </Grid>
                    </Grid>
                </Card>
            </Grid>
        </Grid>
    );
}