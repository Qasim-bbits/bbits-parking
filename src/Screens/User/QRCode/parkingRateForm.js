import React, {useState, useEffect} from 'react';
import {Box, Button, Divider, IconButton, Typography, lighten, darken, Grid, useTheme, Modal, TextField} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CircularSlider from '@fseehawer/react-circular-slider';
import { CircleSlider } from "react-circle-slider";
import moment from 'moment';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import parkingService from '../../../services/parking-service';
import Spinner from '../../../Common/Spinner';
import SnackAlert from '../../../Common/Alerts';
import Payment from './Payment';
import { config } from '../../../Constants';
import helpers from '../../../Helpers/Helpers';
import ConfirmDiallog from '../../../shared/ConfirmDiallog';
import parkingServices from "../../../services/parking-service";

function ParkingRateForm(props) {
  const theme = useTheme();
  const [value, setValue] = useState(props.stepData[0]);
  const [spinner, setSpinner] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [pk, setPk] = useState();
  const [stripePromise, setStripePromise] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [kickOutParking, setKickOutParking] = useState([]);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [customRate, setCustomRate] = useState('');
  
  useEffect(() => {
    if(props.selectedTariff.enable_custom_rate)
      props.openCustomRateModal();
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

  const handleWheelChange = (value)=>{
    if(props.stepData.length === 1){
      return;
    }
    props.setShowPayment(false);
    props.handleChange(value);
  }

  const purchaseParking= async (e)=>{
    e.preventDefault();
    setSpinner(true);
    if(props.rateCycle[props.steps].rate == 0){
      let body = {
        paymentMethod: '',
        amount: (props.rateCycle[props.steps].total/100).toFixed(2),
        plate: props.plate,
        // user: '',
        zone: props.zone,
        city: props.city,
        from: props.rateCycle[props.steps].current_time,
        to: props.rateCycle[props.steps].time_desc,
        coord: props.center,
        rate: props.selectedTariff._id,
        service_fee: props.rateCycle[props.steps].service_fee,
        org: props.org._id
      }
      const res = await parkingService.buyParking(body);
      setSpinner(false);
      if(!res.data.message){
        props.showReciept();
        props.setParking(res.data)
        sessionStorage.removeItem("showParking")
        // window.location.reload();
      }else if(res.data.message == 'kickOutZone'){
        setDialogTitle(props.literals.parking_already_purchased)
        setDialogContent(`Are you sure, you want to kick out this ${res.data.parkings[0].plate} plate`)
        setKickOutParking(res.data.parkings);
        setOpenDialog(true);
      }else{
        setAlertMessage(res.data.message);
        setSeverity('error');
        setShowAlert(true);
      }
    }else{
      if(props.org.payment_gateway == 'moneris'){
        props.showMoneris();
        return;
      }
      props.setShowPayment(true);
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
    setAlertMessage(props.literals.plate_kickout_purchase_now);
    setSeverity('success');
    setShowAlert(true);
    setSpinner(false);
    setOpenDialog(false);
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      backgroundColor: '#fff',
      // height: '100%'
    }}>
      <Box sx={{display: 'flex', backgroundColor: theme.palette.primary.main, width: '100%'}}>
        <IconButton
          color="inherit"
          edge="end"
          onClick={props.back}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box sx={{display: 'flex', width: '80%', justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
        <Typography variant='h5' align='left' sx={{marginTop: 5, color: 'primary.main'}} >
          <IconButton
            color="inherit"
            edge="start"
          >
            <LocalParkingIcon />
          </IconButton>
          {props.literals.select_period_your_stay}
        </Typography>
      </Box>
      <Box sx={{width: '80%', background: '#f8f8f8'}}>
        <Box sx={{display: 'flex', marginTop: 2, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='caption' align='left' sx={{color: 'primary.main'}} >
            {props.rateCycle[props.steps].current_time}
          </Typography>
        </Box>
        <Divider/>
        <Box sx={{display: 'flex', marginTop: 2, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='caption' align='left' sx={{color: 'primary.main'}} >
            {props.literals.parking_session_end_at}
          </Typography>
          <Typography variant='caption' align='left' 
            sx={{background: theme.palette.primary.main, color: '#FFF', padding: '0 23px', borderRadius: '17px'}} 
          >
            {props.rateCycle[props.steps].day}
          </Typography>
        </Box>
        <Box sx={{display: 'flex', marginTop: 2, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main'}} >
            {moment(props.rateCycle[props.steps].time_desc, "MMMM Do YYYY, hh:mm a").format("MMM Do YYYY")}
          </Typography>
          <Typography variant='h4' align='left' sx={{color: 'primary.main'}} >
            {moment(props.rateCycle[props.steps].time_desc, "MMM Do YYYY, hh:mm a").format("hh:mm a")}
          </Typography>
        </Box>
      </Box>
      <Divider sx={{width: '80%'}}/>
      <Box sx={{display: 'flex', width: '80%', marginTop: 2, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
        <Typography variant='caption' align='left' sx={{color: 'primary.main'}} >
          {props.literals.total_incl_GST}
        </Typography>
        <Typography variant='caption' align='left' sx={{color: 'primary.main'}} >
          ${(props.rateCycle[props.steps].rate/100).toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{display: 'flex', width: '80%', marginTop: 2, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
        <Typography variant='caption' align='left' sx={{color: 'primary.main'}} >
          {props.literals.service_fee}
        </Typography>
        <Typography variant='caption' align='left' sx={{color: 'primary.main'}} >
          ${(props.rateCycle[props.steps].service_fee/100).toFixed(2)}
        </Typography>
      </Box>
      <Box sx={{width: '80%', textAlign: 'center', position: 'relative', my: 2}}>
      {/* <Grid sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50% , -50%)', webkitTransform: 'translate(-50%, -10%)'}}>
        <Grid>
          <Typography variant='h6' color={darken(theme.palette.primary.main,0.25)}>${value}</Typography>
          <Typography variant='caption' color="primary">{props.rateCycle[props.steps].time_diff}</Typography>
        </Grid>
      </Grid> */}
      {/* <CircleSlider
        min={0} max={(props.stepData.length === 1) ? 1 : props.stepData.length-1} stepSize={1} 
        circleWidth={30} progressWidth={30} knobRadius={17}
        gradientColorFrom={lighten(theme.palette.primary.main,0.5)}
        gradientColorTo={theme.palette.primary.main}
        knobColor={darken(theme.palette.primary.main,0.5)}
        shadow={true}
        // showTooltip={true}
        onChange={(value)=>{setValue(props.stepData[(props.stepData.length === 1) ? 0 : value]);console.log(value);handleWheelChange(props.stepData[value])}}
      /> */}
        <Grid container spacing={2} sx={{textAlign: 'center'}}>
          {props.rateCycle.map((x,index)=>{
            return(
              <Grid item xs={6}>
                <Button
                  variant={(props.steps === index) ? 'contained' : 'outlined'}
                  size='small'
                  sx={{width: '90%', px: 0, py:1}}
                  onClick={()=>{props.handleChange(index);props.setShowPayment(false);}}
                >
                  ${(x.rate/100)} | {moment(x.time_desc, "MMMM Do YYYY, hh:mm a").format("hh:mm a")}
                </Button>
              </Grid>
            )
          })}
          {props.selectedTariff.enable_custom_rate && 
            <Grid item xs={6}>
              <Button
                variant='outlined'
                size='small'
                sx={{width: '90%', px: 0, py:1}}
                onClick={() => props.openCustomRateModal()}
              >
                {props.literals.custom_rate}
              </Button>
            </Grid>
          }
        </Grid>
        {/* <Box sx={{position: 'absolute', left: '41%', top: '40%'}} >
          <Typography variant='subtitle1' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
            {props.rateCycle[props.steps].time_diff}
          </Typography>
          <Typography variant='h6' align='left' sx={{color: 'primary.main', textAlign: 'center'}} >
            ${(props.rateCycle[props.steps].total/100).toFixed(2)}
          </Typography>
        </Box> */}
        {/* <CircleSlider 
          value={props.steps} 
          min={0} 
          max={props.rateCycle.length-1} 
          onChange={handleWheelChange} 
          size={280}
        /> */}
        {/* <CircularSlider
            label={props.rateCycle[props.steps].time_diff}
            labelSize
            labelColor={theme.palette.primary.main}
            knobColor={theme.palette.primary.main}
            progressColorFrom={theme.palette.primary.main}
            progressColorTo={theme.palette.primary.main}
            progressSize={26}
            valueFontSize={'3rem'}
            trackColor="#eeeeee"
            trackSize={24}
            knobSize={72}
            labelBottom={true}
            prependToValue="$"
            data={props.stepData}
            dataIndex={0}
            onChange={ value => { handleWheelChange(value); } }
        /> */}
      </Box>
      <Box sx={{width:'90%', my: 1}}>
        <form onSubmit={purchaseParking} style={{width:'100%',marginTop: '16px'}}>
            {!props.showPayment &&
            <Button 
              type='submit'
              size='large'
              variant='contained'
              sx={{borderRadius: 8, width: '100%',my: 2}}
            >
              {props.literals.confrim_to_park || '$'+(props.rateCycle[props.steps].total/100).toFixed(2)}
            </Button>}
        </form>
        {props.showPayment &&
          <Elements stripe={stripePromise}>
            <Payment props={props}/>
          </Elements>
        }
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
      <Modal
        open={props.customRateModal}
        onClose={props.closeCustomRateModal}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Grid container spacing={2} sx={{placeContent: "center"}}>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.how_many_days_wants_to_park}
                color="primary"
                type="number"
                value={customRate}
                onChange={(e)=> setCustomRate(e.target.value)}
                size="small"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                onClick={()=>props.handleCustomRate(customRate)}
                >
                {props.literals.add}
              </Button>
              <Button
                sx={{ml: 2}}
                type="submit"
                color="primary"
                variant="outlined"
                onClick={()=>props.closeCustomRateModal()}
                >
                {props.literals.cancel}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <ConfirmDiallog
        openDialog = {openDialog}
        dialogTitle = {dialogTitle}
        dialogContent = {dialogContent}

        closeDialog = {()=>setOpenDialog(false)}
        delItem = {()=>kickOutPlate()}
      />
    </Box>
  );
}

export default ParkingRateForm;