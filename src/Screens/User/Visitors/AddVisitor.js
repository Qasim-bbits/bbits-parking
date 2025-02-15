import React, { useEffect, useState } from 'react';
import {Button, Grid, Typography, TextField, Paper, Autocomplete} from "@mui/material";
import moment from 'moment';
import { Elements } from '@stripe/react-stripe-js';
import Payment from '../QRCode/Payment';
import helpers from '../../../Helpers/Helpers';
import { loadStripe } from '@stripe/stripe-js';

export default function AddVistor(props) {
  const [stripePromise, setStripePromise] = useState(null);
  const [pk, setPk] = useState();

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
    <Paper elevation={2} sx={{ width: '100%',p: 3, height: '80vh' }}>
        <Typography variant="h6" color="primary">
          {props.literals.visitor}
        </Typography>
          <Grid container spacing={2} sx={{mt:2}}>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={props.zones}
                getOptionLabel={(option) => option.zone_name}
                value={props.selectedZone}
                disableClearable
                onChange={(event, newValue)=>props.onSelectedZone(newValue)}
                renderInput={(params) => (
                <TextField {...params} label={props.literals.select_zone} color="primary" size="small" required/>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={props.rateTypes}
                getOptionLabel={(option) => option.rate_name}
                value={props.selectedRateType}
                disableClearable
                onChange={(event, newValue)=>props.onSelectedRateType(newValue, props.selectedZone)}
                renderInput={(params) => (
                <TextField {...params} label={props.literals.select_rate} color="primary" size="small" required/>
                )}
              />
            </Grid>
            <Grid item xs={12} alignSelf={"center"}>
              <Grid container spacing={2} sx={{textAlign: 'center'}}>
                {props.rateCycle.map((x,index)=>{
                  return(
                    <Grid item xs={6}>
                      <Button
                        variant={(props.steps === index) ? 'contained' : 'outlined'}
                        size='small'
                        sx={{width: '90%', px: 0, py:1}}
                        onClick={()=>{props.setSteps(index)}}
                      >
                        ${(x.rate/100)} | {moment(x.time_desc, "MMMM Do YYYY, hh:mm a").format("hh:mm a")}
                      </Button>
                    </Grid>
                  )
                })}
              </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <TextField
                label={props.literals.plate}
                color="primary"
                type="text"
                name="plate"
                value={props.inputField["plate"]}
                onChange={props.handleChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} alignSelf={"center"}>
              {!props.showPayment && <Button type="submit" color="primary" variant="contained" onClick={props.handleSubmit}>
                {props.literals.add}
              </Button>}
              {props.showPayment &&
                <Elements stripe={stripePromise}>
                  <Payment props={props}/>
                </Elements>
              }
            </Grid>
          </Grid>
    </Paper>
        
  );
}