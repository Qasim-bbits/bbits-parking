import React, { useCallback } from 'react';
import Box from "@mui/material/Box";
import { Button, IconButton, Typography, useMediaQuery, Divider, useTheme, Grid, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import moment from 'moment';
import ReceiptTop from "../../../assets/images/Backgrounds/receipt_top.png"
import ReceiptBottom from "../../../assets/images/Backgrounds/receipt_bottom.png"
import List from "../../../components/Icons/List";
import Location from "../../../components/Icons/Location"
import ParkIn from "../../../components/Icons/ParkIn"
import ParkOut from "../../../components/Icons/ParkOut"
import Plate from "../../../components/Icons/Plate"
import Rate from "../../../components/Icons/Rate"
import Amount from '../../../components/Icons/Amount';
import Clock from '../../../components/Icons/Clock';
import Percantage from '../../../components/Icons/Percantage';
import SmallClock from '../../../components/Icons/SmallClock';
import downloadjs from 'downloadjs';
import html2canvas from 'html2canvas';
import { ExpandMore, Message } from '@mui/icons-material';

const iconStyle = { width: '25px', marginRight: '7px', marginLeft: '7px' }

function TicketReceipt(props) {
  const theme = useTheme();
  const download = useCallback(async () => {
    const pricingTableElmt = document.getElementsByClassName('.pricing-table');
    console.log(pricingTableElmt)
    if (!pricingTableElmt) return;

    const canvas = await html2canvas(pricingTableElmt);
    const dataURL = canvas.toDataURL('image/png');
    downloadjs(dataURL, 'download.png', 'image/png');
  }, []);

  return (
    <div className={' pricing-table'}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: '#fff',
        // height: '100%'
      }}>
        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', color: 'black' }}>
          <Typography variant='h6' align='right' sx={{ color: 'primary.main', width: '90%' }} >
            <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {props.literals.ticket_pay_receipt}
            </Box>
          </Typography>
        </Box>
        <Divider sx={{ width: '80%' }} />
        {props.ticket.map((x, i) => {
          return (
            <Accordion defaultExpanded={i == 0} sx={{my: 2, width: '80%'}}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
            >
              <Typography sx={{fontWeight: 'bold'}}>
                Ticket {i+1}
                &nbsp;&nbsp;<span style={{color: 'red'}}>{x?.ticketIssued?.ticket?.ticket_type == 'booting' ? '(Booted)' : ''}</span>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {x?.ticketIssued?.message_after_paid && <>
                <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'center' }}>
                  <Typography variant='subtitle1' sx={{ color: 'green' }} >
                    {x?.ticketIssued?.message_after_paid}
                  </Typography>
                </Box>
                <Divider/>
              </>}
              <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'space-between', alignItems: 'center', color: 'black' }}>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <Box sx={iconStyle}>
                      <List color={theme.palette.primary.main} />
                    </Box>
                    {props.literals.ticket_num}
                  </Box>
                </Typography>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {x?.ticketIssued?.ticket_num}
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black' }}>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={iconStyle}>
                      <Location color={theme.palette.primary.main} />
                    </Box>
                    {x?.ticketIssued?.zone?.zone_name}, {x?.ticketIssued?.city?.city_name}
                  </Box>
                </Typography>
              </Box>
              <Divider/>
              <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'space-between', alignItems: 'center', color: 'black' }}>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main', textAlign: 'center' }} >
                  <Box>
                    <ParkIn color={theme.palette.primary.main} width={'46'} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {moment(x?.ticketIssued?.parking?.from).format('ll')}
                  </Box>
                  <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
                    {moment(x?.ticketIssued?.parking?.from).format('hh:mm a')}
                  </Box>
                </Typography>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', justifyContent: 'center' }}>
                    <Box>
                      <Clock color={theme.palette.primary.main} width={'46'} />
                    </Box>
                  </Box>
                  {/* <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
              {props.Countdown}
            </Box> */}
                </Typography>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main', textAlign: 'center' }} >
                  <Box>
                    <ParkOut color={theme.palette.primary.main} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {moment(x?.ticketIssued?.parking?.to).format('ll')}
                  </Box>
                  <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center', placeContent: 'center' }}>
                    {moment(x?.ticketIssued?.parking?.to).format('hh:mm a')}
                  </Box>
                </Typography>
              </Box>
              <Divider sx={{ mt: 2 }} />
              <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black' }}>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={iconStyle}>
                      <Plate color={theme.palette.primary.main} />
                    </Box>
                    {x?.ticketIssued?.plate}
                  </Box>
                </Typography>
              </Box>
              <Divider/>
              <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black' }}>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={iconStyle}>
                      <List color={theme.palette.primary.main} />
                    </Box>
                    {x?.ticketIssued?.ticket?.ticket_name}
                  </Box>
                </Typography>
              </Box>
              <Divider/>
              <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black' }}>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={iconStyle}>
                      <SmallClock color={theme.palette.primary.main} />
                    </Box>
                    {props.literals.issued_at}
                  </Box>
                </Typography>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main', alignSelf: 'center' }} >
                  <Box>
                    {moment(x?.ticketIssued?.issued_at).format('MMM Do YY, hh:mm a')}
                  </Box>
                </Typography>
              </Box>
              <Divider/>
              <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black' }}>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={iconStyle}>
                      <SmallClock color={theme.palette.primary.main} />
                    </Box>
                    {props.literals.ticket_passed_days}
                  </Box>
                </Typography>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main', alignSelf: 'center' }} >
                  <Box>
                    {x?.ticketAmount?.day_passed} {props.literals.days}
                  </Box>
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', marginTop: 1, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black' }}>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main' }} >
                  <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase', display: 'flex', alignItems: 'center' }}>
                    <Box sx={iconStyle}>
                      <Amount color={theme.palette.primary.main} />
                    </Box>
                    {props.literals.amount_paid}
                  </Box>
                </Typography>
                <Typography variant='subtitle1' align='left' sx={{ color: 'primary.main', alignSelf: 'center' }} >
                  <Box sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                    $ {(x?.ticketAmount?.rate / 100).toFixed(2)}
                  </Box>
                </Typography>
              </Box>
            
            </AccordionDetails>
          </Accordion>
          )
        })}

        <Grid container spacing={1} sx={{ placeContent: "center", p: 2, width: '80%' }}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              {props.literals.total_amount}:
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1" align='end' color="primary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
              $ {(props.ticket?.reduce((n, { ticketAmount }) => n + ticketAmount.rate, 0) / 100).toFixed(2)}
            </Typography>
          </Grid>
        </Grid>
        {/* <Button
          size='small'
          variant='contained'
          // onClick={()=>props.emailTicketReciept({
          //   plate: props.ticket?.ticketIssued?.plate,
          //   ticket_num: props.ticket?.ticketIssued?.ticket_num
          // })}
          onClick={download}
        >
          {props.literals.send_by_email}
        </Button> */}
      </Box>
    </div>
  );
}

export default TicketReceipt;