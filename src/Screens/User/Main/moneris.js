import React, {useState, useEffect, useRef} from 'react';
import monerisService from '../../../services/moneris-service';
import parkingService from '../../../services/parking-service';
import Spinner from '../../../Common/Spinner';
import SnackAlert from '../../../Common/Alerts';

function Moneris(props) {
  const MonerisRef = useRef();
  const [spinner, setSpinner] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(()=>{
    console.log('asda')
    handleMoneris();
  },[MonerisRef])

  const handleMoneris = async ()=>{
    setSpinner(true);
    let amount = (props.rateCycle[props.steps].total/100).toFixed(2)
    const res = await monerisService.generateToken({amount: amount.toString(), org_id: props.org._id});
    if(res.data.success == 'false'){
      setAlertMessage(res.data.error.message);
      setSeverity('error');
      setShowAlert(true);
      props.back();
      return;
    }
    const script = document.createElement("script");    
    script.async = true;
    if(props.org.payment_envoirnment === 'test'){
      script.src = "https://gatewayt.moneris.com/chkt/js/chkt_v1.00.js";    // Testing
    }else{
      script.src = "https://gateway.moneris.com/chkt/js/chkt_v1.00.js";  // Production
    }
    document.body.appendChild(script);
    
    script.onload = ()=> {
        MonerisRef.current = new window.monerisCheckout();
        if(props.org.payment_envoirnment === 'test'){
          MonerisRef.current.setMode("qa");     //Testing
        }else{
          MonerisRef.current.setMode("prod");   //Production
        }
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
    console.log(res.data.receipt?.result)
    if(res.data.receipt?.result == "a"){
      sessionStorage.removeItem("showParking")
      window.location.reload()
    }else{
      console.log('asd')
      // MonerisRef.current.closeCheckout(e.ticket);
      window.location.reload()
      // props.back();
    }
  }

  const cancelTransaction = (e)=>{
    console.log(e)
    MonerisRef.current.closeCheckout(e.ticket);
    props.back();
  }

  const monerisReceipt = async (ticket) =>{
    const res = await monerisService.monerisReceipt({ticket: ticket, org_id: props.org._id});
    // console.log(res.data)
    return res;
  }

  const purchaseParking= async (ticket)=>{
    setSpinner(true);
    let body = {
      paymentMethod: '',
      amount: props.rateCycle[props.steps].total,
      plate: props.plate,
      user: props.user?.result?._id,
      zone: props.zone,
      city: props.city,
      from: props.rateCycle[props.steps].current_time,
      to: props.rateCycle[props.steps].time_desc,
      service_fee: props.rateCycle[props.steps].service_fee,
      coord: props.center,
      rate: props.selectedTariff._id,
      ticket: ticket,
      org: props.org._id
    }
    const res = await parkingService.buyParking(body);
    setSpinner(false);
    if(!res.data.message){
      props.setParking(res.data);
      props.showReciept();
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