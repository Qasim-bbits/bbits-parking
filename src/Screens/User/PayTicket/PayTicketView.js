import React, {useState, useEffect} from 'react';
import { Box, Stepper, Step, StepLabel, Button, Typography, Autocomplete, Grid, TextField, Table, TableBody, TableRow, TableCell, useTheme, Divider, ImageList, ImageListItem } from '@mui/material';
import moment from 'moment';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import helpers from '../../../Helpers/Helpers';
import Stripe from './Stripe';
import { router } from '../../../Routes/routhPaths';
import { useNavigate } from 'react-router-dom';
import TicketReceipt from './TicketReceipt';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const customStyles = {
  overlay: {
    zIndex: 1200
  },
};

export default function PayTicketView(props) {
  const navigate = useNavigate();
  const theme = useTheme();
  const [stripePromise, setStripePromise] = useState(null);
  const [pk, setPk] = useState();
  const [ photoIndex, setPhotoIndex ] = useState(0);
  const [ isOpen, setIsOpen ] = useState(false);
  const steps = [props.literals.search_ticket, props.literals.summary+' & '+props.literals.payment, props.literals.receipt];

  useEffect(() => {
    setTimeout(() => {
      let org = props.org;
      if(org.payment_gateway == 'stripe'){
        let stripe_key = helpers.crypto_decrypt(org.stripe_publishable_key);
        setPk(stripe_key);
      }
    }, 5000);
  }, []);
  
  useEffect(() => {
    if (pk && !stripePromise) {
      setStripePromise(loadStripe(pk));
    }
    
  }, [pk, stripePromise]);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Stepper activeStep={props.activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {props.activeStep === 0 &&
        <Grid container spacing={3} sx={{placeContent: "center", p: 2}}>
          <Grid item xs={12}>
            <Box component="form" onSubmit={props.handleSubmit}>
              <Grid container spacing={3} sx={{placeContent: "center", p: 1}}>
                <Grid item xs={12} align="right">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={props.organizations}
                    getOptionLabel={(option) => option.org_name}
                    value={props.selectedOrg}
                    readOnly={(props.user == null || props.user?.result?.role !== 'root') ? true : false}
                    onChange={(event, newValue)=>props.setSelectedOrg(newValue)}
                    renderInput={(params) => (
                    <TextField {...params} label={props.literals.select_organization} color="primary" size="small" required/>
                    )}
                  />
                </Grid>
                <Grid item xs={12} align="right">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={props.cities}
                    getOptionLabel={(option) => option.city_name}
                    value={props.selectedCity}
                    onChange={(event, newValue)=>props.setSelectedCity(newValue)}
                    renderInput={(params) => (
                    <TextField {...params} label={props.literals.select_city} color="primary" size="small" required/>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      id="standard-error-helper-text"
                      label={props.literals.ticket_num}
                      color="primary"
                      type="text"
                      name="ticket_num"
                      value={props.inputField["ticket_num"]}
                      onChange={props.handleChange}
                      size="small"
                      required
                      fullWidth
                    />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      id="standard-error-helper-text"
                      label={props.literals.plate}
                      color="primary"
                      type="text"
                      name="plate"
                      value={props.inputField["plate"]}
                      onChange={props.handleChange}
                      size="small"
                      required
                      fullWidth
                    />
                </Grid>
                <Grid item xs={12} align="end">
                  <Button type='submit' variant="outlined" size="small" color="primary">
                    {props.literals.next}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      }
      {props.activeStep === 1 &&
        <Grid container spacing={1} sx={{placeContent: "center", p: 2}}>
          {/* <Grid item xs={12}>
            <Typography variant="body1" color="primary" sx={{textTransform: 'uppercase'}}>{props.literals.summary}</Typography>
          </Grid> */}
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary">
              {props.literals.ticket_num}:
            </Typography>
          </Grid>
          <Grid item xs={6} align='end'>
            <Typography variant="subtitle1" color="primary">
              {props.ticket?.ticketIssued?.ticket_num}
            </Typography>
          </Grid>
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} alignSelf="center">
            <Typography variant="subtitle2">
              {props.literals.images}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
          <ImageList sx={{ overflowX: 'auto' }}>
            <ImageListItem sx={{display: 'flex', flexDirection: 'row'}}>
              {props.ticket?.ticketIssued?.images.map((image,index) => {
                return (
                  <Button type="button" onClick={()=>{setIsOpen(true);setPhotoIndex(index)}}>
                    <img
                      src={image}
                      srcSet={image}
                      alt='title'
                      loading='lazy'
                      style={{paddingRight: '1em'}}
                    />
                  </Button>
                )
              })}
            </ImageListItem>
          </ImageList>
          </Grid>
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              {props.literals.location}:
            </Typography>
          </Grid>
          <Grid item xs={6} align='end'>
            <Typography variant="subtitle2">
              {props.ticket?.ticketIssued?.zone?.zone_name}, {props.ticket?.ticketIssued?.city?.city_name}
            </Typography>
          </Grid>
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              {props.literals.plate}:
            </Typography>
          </Grid>
          <Grid item xs={6} align='end'>
            <Typography variant="subtitle2">
              {props.ticket?.ticketIssued?.plate}
            </Typography>
          </Grid>
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography variant="subtitle2">
              {props.literals.ticket_name}:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} align='end'>
            <Typography variant="subtitle2">
              {props.ticket?.ticketIssued?.ticket?.ticket_name}
            </Typography>
          </Grid>
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              {props.literals.parking_id}:
            </Typography>
          </Grid>
          {props.ticket?.ticketIssued?.parking !== undefined &&
            <>
              <Grid item xs={6} align='end'>
                <Typography variant="subtitle2">
                  {props.ticket?.ticketIssued?.parking?.parking_id}
                </Typography>
              </Grid>
              <Grid item xs={12}><Divider width="100%"/></Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Typography variant="subtitle2">
                  {props.literals.parking} {props.literals.start_date_time} - {props.literals.end_date_time}:
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} align='end'>
                <Typography variant="subtitle2">
                  {moment(props.ticket?.ticketIssued?.parking?.from).format('MMM Do YY, hh:mm a')} - {moment(props.ticket?.ticketIssued?.parking?.to).format('MMM Do YY, hh:mm a')} 
                </Typography>
              </Grid>
            </>
          }
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2">
              {props.literals.ticket} {props.literals.issued_at}:
            </Typography>
          </Grid>
          <Grid item xs={6} align='end'>
            <Typography variant="subtitle2">
              {moment(props.ticket?.ticketIssued?.issued_at).format('MMM Do YY, hh:mm a')}
            </Typography>
          </Grid>
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} alignSelf="center">
            <Typography variant="subtitle2">
              {props.literals.ticket_duration}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} align='end'>
            <Typography variant="subtitle2">
              <Table size="small" sx={{width: 'fit-content', float: 'right'}}>
                {props.ticket?.ticketAging.map(x=>{
                  return(
                    <TableBody>
                      <TableRow>
                        <TableCell sx = {{
                          border: 0,
                          color: (x._id == props.ticket?.ticketAmount?._id) ? theme.palette.primary.main : ''
                        }}>
                          $ {(x.rate/100).toFixed(2)}
                        </TableCell>
                        <TableCell sx = {{
                          border: 0,
                          color: (x._id == props.ticket?.ticketAmount?._id) ? theme.palette.primary.main : ''
                        }}>
                          {(x.applied_from == 0) ? props.literals.within + ' '+ (x.applied_to/24/60) +' '+props.literals.days :  
                          (x.applied_to == null) ? props.literals.after + ' ' + (x.applied_from/24/60 +' '+props.literals.days) : 
                          props.literals.within + ' ' + (x.applied_from/24/60) +' '+props.literals.to+' '+ (x.applied_to/24/60) +' '+props.literals.days}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )
                })}
              </Table>
            </Typography>
          </Grid>
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={6} sx={{background: '"#eeeeee52"'}}>
            <Typography variant="subtitle2">
              {props.literals.ticket_passed_days}:
            </Typography>
          </Grid>
          <Grid item xs={6} align='end' sx={{background: '"#eeeeee52"'}}>
            <Typography variant="subtitle2">
              {props.ticket?.ticketAmount?.day_passed} {props.literals.days}
            </Typography>
          </Grid>
          <Grid item xs={12}><Divider width="100%"/></Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle2" color="primary">
              {props.literals.amount}:
            </Typography>
          </Grid>
          <Grid item xs={6} align='end'>
            <Typography variant="subtitle2" color="primary">
              $ {(props.ticket?.ticketAmount?.rate/100).toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} align="end">
            {props.org.payment_gateway == 'moneris' &&
              <Grid container spacing={2} sx={{placeContent: "center", p: 2}}>
                <Grid item xs={6} align="start">
                  <Button
                    color="inherit"
                    onClick={props.handleBack}
                    sx={{ mr: 1 }}
                  >
                    {props.literals.back}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button type='button' variant="contained" size="small" color="primary" onClick={props.showMoneris}>
                    {props.literals.pay}
                  </Button>
                </Grid>
              </Grid>
            }
            {props.org.payment_gateway == 'stripe' &&
              <Elements stripe={stripePromise}>
                <Stripe
                  amount={props.ticket?.ticketAmount?.rate}
                  plate={props.ticket?.ticketIssued?.plate}
                  issued_at={props.ticket?.ticketIssued?.issued_at}
                  id={props.ticket?.ticketIssued?._id}
                  org={props.org}
                  literals={props.literals}
                  zone={props.ticket?.ticketIssued?.zone?.zone_name}

                  handleNext = {props.handleNext}
                  handleBack = {props.handleBack}
                />
              </Elements>
            }
          </Grid>
        </Grid>
      }
      {props.activeStep === 2 &&
        <Grid container spacing={3} sx={{placeContent: "center", p: 2}}>
          <Grid item xs={12}>
            <TicketReceipt
              org={props.org}
              literals={props.literals}
              ticket = {props.ticket}
              emailTicketReciept = {(e)=>props.emailTicketReciept(e)}
            />
          </Grid>
          <Grid item xs={12} align="end">
            <Button type='button' variant="outlined" size="small" color="primary" onClick={()=>navigate(router.main)}>
              {props.literals.back_to_home}
            </Button>
          </Grid>
        </Grid>
      }
      {isOpen && (
        <Lightbox
        reactModalStyle={customStyles}
          mainSrc={props.ticket?.ticketIssued?.images[photoIndex]}
          nextSrc={props.ticket?.ticketIssued?.images[(photoIndex + 1) % props.ticket?.ticketIssued?.images.length]}
          prevSrc={props.ticket?.ticketIssued?.images[(photoIndex + props.ticket?.ticketIssued?.images.length - 1) % props.ticket?.ticketIssued?.images.length]}
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + props.ticket?.ticketIssued?.images.length - 1) % props.ticket?.ticketIssued?.images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % props.ticket?.ticketIssued?.images.length)
          }
        />
      )}
    </Box>
  );
}
