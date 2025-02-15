import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import {Box, Button, Divider, Chip, Grid, useTheme, Typography, Paper} from "@mui/material";
import {PaymentRequestButtonElement, useStripe, CardElement, useElements, CardNumberElement, CardExpiryElement, CardCvcElement} from '@stripe/react-stripe-js';
import parkingService from '../../../services/parking-service';
import Spinner from '../../../Common/Spinner';
import SnackAlert from '../../../Common/Alerts';
import {ReactComponent as Amex} from '../../../assets/icons/cards/amex.svg'
import {ReactComponent as JCB} from '../../../assets/icons/cards/jcb.svg'
import {ReactComponent as Mastercard} from '../../../assets/icons/cards/mastercard.svg'
import {ReactComponent as Visa} from '../../../assets/icons/cards/visa.svg'
import { config } from '../../../Constants';
import ConfirmDiallog from '../../../shared/ConfirmDiallog';
import parkingServices from "../../../services/parking-service";

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  '& > :not(style) + :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

const CARD_OPTIONS = {
  style: {
      base: {
          fontSize : '15px',
          color: "#013941",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
          color: "#aab7c4"
          },          
      },
      invalid: {
          color: "#9e2146"
      }
      }
  }

function Payment(props) {
  const theme = useTheme();
  const stripe = useStripe();
  const elements = useElements()
  const [spinner, setSpinner] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [kickOutParking, setKickOutParking] = useState([]);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const user = JSON.parse(sessionStorage.getItem('userLogged'))

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: config.constant.country,
        currency: config.constant.currency,
        total: {
          label: 'BBits Solutions Inc',
          amount: props.props.rateCycle[props.props.steps].total,
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });
      // Check the availability of the Payment Request API.
      pr.canMakePayment().then(result => {
        if (result) {
          console.log(result)
          setPaymentRequest(pr);
        }
      });

      pr.on('paymentmethod', async  (ev) => {
        setSpinner(false);
        let body = {
          paymentMethod : ev.paymentMethod,
          amount : props.props.rateCycle[props.props.steps].total,
          plate: props.props.plate,
          // user: '',
          zone: props.props.zone,
          city: props.props.city,
          from: props.props.rateCycle[props.props.steps].current_time,
          to: props.props.rateCycle[props.props.steps].time_desc,
          // token: ev.token.id
          coord: props.props.center,
          rate: props.props.selectedTariff._id,
          service_fee: props.props.rateCycle[props.props.steps].service_fee,
          org: props.props.org._id,
          tenant_visitor_zone: props.props.tenant_visitor_zone,
          no_of_visitors: props.props.no_of_visitor
        }
        if(user?.result?._id){
          body.user= user.result._id;
          body.added_by= user.result._id;
        }
        ev.complete('success');
        const res = await parkingService.buyParking(body);
        console.log(res.data)

        setSpinner(false);
        if(!res.data.message){
          props.props.showReciept();
          props.props.setParking(res.data)
          // sessionStorage.removeItem("showParking")
          // window.location.reload();
        }else if(res.data.message == 'kickOutZone'){
          setDialogTitle(props.props.literals.parking_already_purchased)
          setDialogContent(`Are you sure, you want to kickout this ${res.data.parkings[0].plate} plate`)
          setKickOutParking(res.data.parkings);
          setOpenDialog(true);
        }else{
          setAlertMessage(res.data.message);
          setSeverity('error');
          setShowAlert(true);
        }
      })
    }
  }, [stripe, props.props.rateCycle[props.props.steps].total]);

  useEffect(() => {
    setSpinner(true);
    if (elements) {
      setSpinner(false)
    }
  }, [elements])

  const purchaseParking= async (e)=>{
    e.preventDefault();
    setSpinner(true);
    if(stripe == null){
      setAlertMessage("Invalid Card details");
      setSeverity('error');
      setShowAlert(true);
      setSpinner(false);
      return;
    }
    const {error, paymentMethod} = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardNumberElement),
    })
    if(!error){
        try{
            let body = {
              paymentMethod : paymentMethod,
              amount : props.props.rateCycle[props.props.steps].total,
              plate: props.props.plate,
              // user: '',
              zone: props.props.zone,
              city: props.props.city,
              from: props.props.rateCycle[props.props.steps].current_time,
              to: props.props.rateCycle[props.props.steps].time_desc,
              coord: props.props.center,
              service_fee: props.props.rateCycle[props.props.steps].service_fee,
              rate: props.props.selectedTariff._id,
              org: props.props.org._id,
              tenant_visitor_zone: props.props.tenant_visitor_zone,
              no_of_visitors: props.props.no_of_visitor
            }
            
            if(user?.result?._id){
              body.user= user.result._id;
              body.added_by= user.result._id;
            }
            const res = await parkingService.buyParking(body);
            console.log(res.data)
            if(!res.data.message){
              props.props.showReciept();
              props.props.setParking(res.data)
              // sessionStorage.removeItem("showParking")
              // window.location.reload();
            }else if(res.data.message == 'kickOutZone'){
              setDialogTitle(props.props.literals.parking_already_purchased)
              setDialogContent(`Are you sure, you want to kick out this ${res.data.parkings[0].plate} plate`)
              setKickOutParking(res.data.parkings);
              setOpenDialog(true);
            }else{
              setAlertMessage(res.data.message);
              setSeverity('error');
              setShowAlert(true);
            }
        }catch(error){
            console.log("Error", error.message)
            setAlertMessage(error.message);
            setSeverity('error');
            setShowAlert(true);
        }
    }else{
        console.log("Error", error)
        setAlertMessage(error.message);
        setSeverity('error');
        setShowAlert(true);
    }
    setSpinner(false);
  }

  const kickOutPlate = async () =>{
    let body = {
      zone: kickOutParking[0].zone,
      city: kickOutParking[0].city,
      org: kickOutParking[0].org,
      parking: kickOutParking[0]._id,
      kicked_out_plate: kickOutParking[0].plate,
      kicked_out_By: props.plate
    }
    setSpinner(true);
    await parkingServices.kickOutPlate(body);
    setAlertMessage(props.props.literals.plate_kickout_purchase_now);
    setSeverity('success');
    setShowAlert(true);
    setSpinner(false);
    setOpenDialog(false);
  }

  return (
    <>
      <Box sx={{width:'100%', my: 1}}>
        {props.props.rateCycle[props.props.steps].rate !== 0 && paymentRequest && 
        <>
          <PaymentRequestButtonElement options={{paymentRequest}} />
          <Root>
            <Divider sx={{mt:2}}>
              <Chip label="OR" sx={{background: '#1e255930', color: '#2c3680', fontWeight: 'bold'}}/>
            </Divider>
          </Root>
        </>
        }
        {elements && <form onSubmit={purchaseParking} style={{width:'100%',marginTop: '16px'}}>
          <Paper elevation={2} sx={{p:1}}>
            <Grid container>
              <Grid item md={5} xs={12} sx={{mx: 1}} alignSelf={'center'}>
                <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', fontWeight: 'bold'}} >
                  Payment Details:
                </Typography>
              </Grid>
              <Grid item md={5} xs={12} sx={{mx: 1}}>
                <Amex sx={{width: 100}}/><JCB/><Mastercard/><Visa/>
              </Grid>
              <Grid item md={5} xs={12} sx={{m: 1}}>
                <Typography variant='caption' align='left' sx={{color: '#6f6e6e'}} >
                  Card Number
                </Typography>
                <Grid item xs={12} sx={{
                  border: '1px solid '+theme.palette.primary.main,
                  borderRadius: '5px',
                  padding: '10px',
                }}>
                  <CardNumberElement options={CARD_OPTIONS}/>
                </Grid>
              </Grid>
              <Grid item md={3} xs={4} sx={{m: 1}}>
                <Typography variant='caption' align='left' sx={{color: '#6f6e6e'}} >
                  Expiry Date
                </Typography>
                <Grid item xs={12} sx={{
                  border: '1px solid '+theme.palette.primary.main,
                  borderRadius: '5px',
                  padding: '10px',
                }}>
                  <CardExpiryElement options={CARD_OPTIONS}/>
                </Grid>
              </Grid>
              <Grid item md={3} xs={4} sx={{m: 1}}>
                <Typography variant='caption' align='left' sx={{color: '#6f6e6e'}} >
                  CVC
                </Typography>
                <Grid item xs={12} sx={{
                  border: '1px solid '+theme.palette.primary.main,
                  borderRadius: '5px',
                  padding: '10px',
                }}>
                  <CardCvcElement options={CARD_OPTIONS}/>
                </Grid>
              </Grid>
            </Grid>
            <Button 
              type='submit'
              size='large'
              variant='contained'
              sx={{borderRadius: 8, width: '100%',my: 2}}
            >
              ${(props.props.rateCycle[props.props.steps].total/100).toFixed(2)}
            </Button>
          </Paper>
        </form>}
      </Box>
      
      <Spinner
        spinner = {spinner}  
      />
      <SnackAlert
        alertMessage = {alertMessage}
        showAlert = {showAlert}
        severity = {severity}
        
        closeAlert = {()=>setShowAlert(!showAlert)}
      />
      <ConfirmDiallog
        openDialog = {openDialog}
        dialogTitle = {dialogTitle}
        dialogContent = {dialogContent}

        closeDialog = {()=>setOpenDialog(false)}
        delItem = {()=>kickOutPlate()}
      />
    </>
  );
}

export default Payment;