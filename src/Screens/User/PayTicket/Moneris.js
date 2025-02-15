import React, {useState, useEffect, useRef} from 'react';
import monerisService from '../../../services/moneris-service';
import parkingService from '../../../services/parking-service';
import Spinner from '../../../Common/Spinner';
import SnackAlert from '../../../Common/Alerts';
import ticketServices from '../../../services/ticket-service';

function Moneris(props) {
  const MonerisRef = useRef();
  const [spinner, setSpinner] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(()=>{
    handleMoneris();
  },[MonerisRef])

  const handleMoneris = async ()=>{
    setSpinner(true);
    let amount = (props.amount/100).toFixed(2)
    const res = await monerisService.generateToken({amount: amount.toString(), org_id: props.org._id});
    if(res.data.success == 'false'){
      setAlertMessage(res.data.error.message);
      setSeverity('error');
      setShowAlert(true);
      return;
    }
    const script = document.createElement("script");    
    script.async = true;
    script.src = (props.org.payment_envoirnment === 'test') ? 
      'https://gatewayt.moneris.com/chkt/js/chkt_v1.00.js' :
      'https://gateway.moneris.com/chkt/js/chkt_v1.00.js';
    document.body.appendChild(script);
    
    script.onload = ()=> {
        MonerisRef.current = new window.monerisCheckout();
        MonerisRef.current.setMode((props.org.payment_envoirnment === 'test') ? 'qa' : 'prod');
        MonerisRef.current.setCheckoutDiv("monerisCheckout");
        MonerisRef.current.startCheckout(res.data.ticket);
        setSpinner(false);
        MonerisRef.current.setCallback("cancel_transaction", cancelTransaction);
        MonerisRef.current.setCallback("error_event", errorEvent);
        MonerisRef.current.setCallback("payment_receipt", myPaymentReceipt);
        MonerisRef.current.setCallback("payment_complete", myPaymentComplete);
    };
  }

  const errorEvent = (e)=>{
    console.log(e);
  }

  const myPaymentReceipt = async (e)=>{
    console.log('myPaymentReceipt')
    e = JSON.parse(e);
    const res = await monerisReceipt(e.ticket);
    if(res.data.receipt?.result == "a"){
      purchaseParking(e.ticket);
    }
    setSpinner(false)
  }

  const myPaymentComplete = async (e)=>{
    console.log('myPaymentComplete')
    e = JSON.parse(e);
    setSpinner(true)
    const res = await monerisReceipt(e.ticket);
    setSpinner(false)
    if(res.data.receipt?.result == "a"){
      props.handleNext();
    }else{
      MonerisRef.current.closeCheckout(e.ticket);
    }
  }

  const cancelTransaction = (e)=>{
    console.log(e)
    MonerisRef.current.closeCheckout(e.ticket);
    props.handleBack();
  }

  const monerisReceipt = async (ticket) =>{
    const res = await monerisService.monerisReceipt({ticket: ticket, org_id: props.org._id});
    return res;
  }

  const purchaseParking= async (ticket)=>{
    setSpinner(true);
    let body = {
      payment_gateway: "moneris",
      ticketIds: props.ticketIds,
      org: props.org._id,
      amount: props.amount,
      plate: props.plate,
      zone_name: props.zone,
      moneris_ticket: ticket,
    }
    const res = await ticketServices.payTicket(body);
    setSpinner(false);
    if(!res.data.message){
      props.handleNext()
    }else{
      setAlertMessage(res.data.message);
      setSeverity('error');
      setShowAlert(true);
    }
    setSpinner(false);
  }

  return (
    <>
      <div style={{width: '50%'}}>
        <div id="monerisCheckout"></div>
      </div>
      <Spinner
        spinner = {spinner}  
      />
      <SnackAlert
        alertMessage = {alertMessage}
        showAlert = {showAlert}
        severity = {severity}
        
        closeAlert = {()=>setShowAlert(!showAlert)}
      />
    </>
  );
}

export default Moneris;