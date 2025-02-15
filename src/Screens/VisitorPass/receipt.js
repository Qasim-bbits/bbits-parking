import React from 'react';
import Box from "@mui/material/Box";
import {Button, IconButton, Typography, useMediaQuery, Divider, useTheme, Grid, Card} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from 'moment-timezone';
// import ReceiptTop from "../../../assets/images/Backgrounds/receipt_top.png"
// import ReceiptBottom from "../../../assets/images/Backgrounds/receipt_bottom.png"
import List from "../../components/Icons/List";
import Location from "../../components/Icons/Location"
import ParkIn from "../../components/Icons/ParkIn"
import ParkOut from "../../components/Icons/ParkOut"
import Plate from "../../components/Icons/Plate"
import Rate from "../../components/Icons/Rate"
import Amount from '../../components/Icons/Amount';
import Clock from '../../components/Icons/Clock';
import Percantage from '../../components/Icons/Percantage';
import PDFDownloader from '../../components/PDFDownloader/PDFDownloader';

const iconStyle = {width: '25px', marginRight: '7px',  marginLeft: '7px'}

function Receipt(props) {
  moment.tz.setDefault(moment.tz.guess());
  const theme = useTheme();

  return (
    <Grid
            container
            spacing={0}
            style={{ minHeight: '100vh', background: '#eee', placeContent: 'center' }}
        >
            <Grid item md={5} sm={11} xs={12} sx={{ height: '100vh' }}>
                <Card component="form" sx={{ height: '100%', overflow:'auto'}}>
                  <div id="receipt" style={{width: '100%', textAlign: '-webkit-center'}}>
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      width: '100%',
                      backgroundColor: '#fff',
                      // height: '100%'
                    }}>
                      <Box sx={{display: 'flex', backgroundColor: theme.palette.primary.main, width: '100%', justifyContent: 'space-between', alignItems: 'center'}}>
                        <IconButton
                          color="inherit"
                          edge="end"
                          onClick={props.reset}
                        >
                          <ArrowBackIcon />
                        </IconButton>
                        {/* <PDFDownloader
                          downloadFileName={"receipt_"+moment().format("ll")}
                          rootElementId="receipt"
                        /> */}
                      </Box>
                      {/* <Box sx={{display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', color: 'black'}}>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', width: '30%'}} >
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center'}}>
                            <img src={ReceiptTop} width={'100%'}/>
                          </Box>
                        </Typography>
                        <Typography variant='h6' align='right' sx={{color: 'primary.main', width: '70%'}} >
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', mx:2}}>
                            Parking Receipt
                          </Box>
                        </Typography>
                      </Box> */}
                      <Divider sx={{width: '80%'}}/>
                      <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'center', color: 'black'}}>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                            <Box sx={iconStyle}>
                              <List color={theme.palette.primary.main}/>
                            </Box>
                            {props.literals.parking_id}
                          </Box>
                        </Typography>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {props.parking?.parking_id}
                          </Box>
                        </Typography>
                      </Box>
                      <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'center', color: 'black'}}>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
                          <Box>
                            <ParkIn color={theme.palette.primary.main} width={'46'}/>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {moment(props.parking?.from).format('ll')}
                          </Box>
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
                            {moment(props.parking?.from).format('hh:mm a')}
                          </Box>
                        </Typography>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', justifyContent: 'center' }}>
                            <Box>
                              <Clock color={theme.palette.primary.main}/>
                            </Box>
                          </Box>
                        </Typography>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
                          <Box>
                            <ParkOut color={theme.palette.primary.main}/>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {moment(props.parking?.to).format('ll')}
                          </Box>
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
                            {moment(props.parking?.to).format('hh:mm a')}
                          </Box>
                        </Typography>
                      </Box>
                      <Divider sx={{width: '80%', mt:2}}/>
                      <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={iconStyle}>
                              <Location color={theme.palette.primary.main}/>
                            </Box>
                            {props.parking?.zone?.zone_name}, {props.parking?.zone?.city_id?.city_name}
                          </Box>
                        </Typography>
                      </Box>
                      <Divider sx={{width: '80%'}}/>
                      <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={iconStyle}>
                              <Plate color={theme.palette.primary.main}/>
                            </Box>
                            {props.parking?.plate}
                          </Box>
                        </Typography>
                      </Box>
                      <Divider sx={{width: '80%'}}/>
                      <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>            
                            <Box sx={iconStyle}>
                              <Rate color={theme.palette.primary.main}/>
                            </Box>
                            {props.selectedRate.rate_name}
                          </Box>
                        </Typography>
                      </Box>
                      <Divider sx={{width: '80%'}}/>
                      <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box sx={iconStyle}>
                              <Percantage color={theme.palette.primary.main}/>
                            </Box>
                            {props.literals.service_fee}
                          </Box>
                        </Typography>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', alignSelf: 'center'}} >
                          <Box>
                            {(props.parking?.service_fee/100).toFixed(2)} $
                          </Box>
                        </Typography>
                      </Box>
                      <Divider sx={{width: '80%', mb: 2}}/>
                      <Box sx={{display: 'flex', width: '80%', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                            <Box sx={iconStyle}>
                              <Amount color={theme.palette.primary.main}/>
                            </Box>
                            {props.literals.amount_paid}
                          </Box>
                        </Typography>
                        <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', alignSelf: 'center'}} >
                          <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {(props.parking?.amount/100).toFixed(2)} $
                          </Box>
                        </Typography>
                      </Box>
                      {/* <Button size='small' variant='contained' onClick={props.emailReciept}>
                        Send by email
                      </Button> */}
                      {/* <Box sx={{width: '100%'}}>
                        <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                          <img src={ReceiptBottom} width={'100%'}/>
                        </Box>
                      </Box> */}
                    </Box>
                  </div>
                </Card>
                </Grid>
            </Grid>
  );
}

export default Receipt;