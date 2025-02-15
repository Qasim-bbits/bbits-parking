import React, {useState, useEffect} from 'react';
import mainService from '../../../services/main-service';
import SnackAlert from '../../../Common/Alerts';
import Spinner from '../../../Common/Spinner';
import { Layout } from '../../../components/SidebarHeaderWrapper';
import AddVistor from './AddVisitor';
import cityServices from '../../../services/city-service';
import parkingService from '../../../services/parking-service';
import Moneris from '../Main/moneris';

export default function Visitors(props) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [inputField, setInputField] = useState({});
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [rateTypes, setRateTypes] = useState([]);
  const [selectedRateType, setSelectedRateType] = useState(null);
  const [steps, setSteps] = useState(0);
  const [rateCycle, setRateCycle] = useState([]);
  const [stepData, setStepData] = useState([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showMoneris, setShowMoneris] = useState(false);
  const [parking, setParking] = useState({})
  
  const user = JSON.parse(sessionStorage.getItem('userLogged'))

  useEffect(()=>{
    getVisitorZone();
  },[])

  const getVisitorZone = async()=>{
    setShowSpinner(true);
    const res = await cityServices.getTenantAndVisitorZones({org_id: props.org._id});
    setZones(res.data)
    setShowSpinner(false);
    if(res.data.length == 1)
    onSelectedZone(res.data[0])
  }

  const handleChange = (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.name == 'plate' ? e.target.value.toUpperCase() : e.target.value});
  }

  const onSelectedZone = async (e)=>{
    setSelectedZone(e);
    setShowSpinner(true);
    const res = await mainService.getRateById({id: e._id});
    setShowSpinner(false);
    setRateTypes(res.data);
    if(res.data.length == 1)
    onSelectedRateType(res.data[0], e)
  }
  
  const onSelectedRateType = async (e, zone)=>{
    setSelectedRateType(e);
    setShowSpinner(true);
    const res = await mainService.getRateSteps({id: e._id, rate_type: e.rate_type, org: props.org._id, time_zone: zone.city_id?.time_zone})
    setShowSpinner(false);
    let arr = [...res.data];
    let result = [];
    arr.map(x=>{
      result.filter(y=>y.time == x.time).length == 0 && result.push(x);
    })
    setRateCycle(result);
    if(result.length > 0){
      var data = result.map(function(item) {
        return ((item['total']/100).toFixed(2));
      });
      setStepData(data)
    }else{
      setAlertMessage(res.data.msg);
      setSeverity("error");
      setShowAlert(true);
    }
  }

  const handleSubmit = async()=>{
    if(rateCycle[steps].total == 0){
      let body = {
        paymentMethod: '',
        amount : rateCycle[steps].total,
        plate: inputField.plate,
        user: user.result._id,
        added_by: user.result._id,
        zone: selectedZone._id,
        city: selectedZone.city_id._id,
        from: rateCycle[steps].current_time,
        to: rateCycle[steps].time_desc,
        service_fee: rateCycle[steps].service_fee,
        rate: selectedRateType._id,
        org: props.org._id,
        tenant_visitor_zone: true,
        no_of_visitors: user.result.no_of_visitors
      }
      setShowSpinner(true);
      const res = await parkingService.buyParking(body);
      setShowSpinner(false);
      if(res.data.message){
        setAlertMessage(res.data.message);
        setSeverity("error");
        setShowAlert(true);
      }else{
        let plate = JSON.parse(localStorage.getItem('plates'));
        if (plate !== null) {
          plate.push(inputField['plate'].toUpperCase())
          localStorage.setItem('plates', JSON.stringify(plate));
        }
        sessionStorage.removeItem("showParking");
        setAlertMessage('Visitor Pass Purchased');
        setSeverity("success");
        setShowAlert(true);
        window.location.reload();
      }
    }else{
      if(props.org.payment_gateway == 'moneris'){
        setShowMoneris(true);
        return;
      }
      setShowPayment(true);
    }
  }

  const showReceipt = async()=> {
    console.log('show')
    let plate = JSON.parse(localStorage.getItem('plates')) || [];
    plate.push(inputField['plate'].toUpperCase())
    localStorage.setItem('plates', JSON.stringify(plate));
    setAlertMessage('Visitor Pass Purchased');
    setSeverity("success");
    setShowAlert(true);
    sessionStorage.removeItem("showParking");
    window.location.reload()
  }

  return (
    <>
        <Layout literals = {props.literals} org={props.org}>
          {!showMoneris && <AddVistor 
                inputField = {inputField}
                literals = {props.literals}
                zones = {zones}
                selectedZone = {selectedZone}
                rateTypes = {rateTypes}
                selectedRateType = {selectedRateType}
                rateCycle = {rateCycle}
                steps = {steps}
                showPayment = {showPayment}
                org={props.org}
                plate={inputField.plate}
                zone={selectedZone?._id}
                city={selectedZone?.city_id?._id}
                selectedTariff={selectedRateType}  
                tenant_visitor_zone={true}
                no_of_visitor={user.result.no_of_visitors}

                onSelectedZone = {(e)=>onSelectedZone(e)}
                onSelectedRateType = {(e,zone)=>onSelectedRateType(e,zone)}
                setSteps = {(e)=>setSteps(e)}
                handleChange = {(e)=>handleChange(e)}
                handleSubmit = {(e)=>handleSubmit(e)}
                showReciept={() => showReceipt()}
                setParking={(e) => setParking(e)}
            />}
            {showMoneris && <Moneris
              steps={steps}
              rateCycle={rateCycle}
              user={user}
              plate={inputField.plate}
              zone={selectedZone._id}
              city={selectedZone.city_id._id}
              selectedTariff={selectedRateType}
              stepData={stepData}
              org={props.org}
              tenant_visitor_zone={true}
              no_of_visitor={user.result.no_of_visitors}

              showReciept={() => showReceipt()}
              back={() => setShowMoneris(false)}
              setParking={(e) => setParking(e)}
            />}
            <SnackAlert
                alertMessage = {alertMessage}
                showAlert = {showAlert}
                severity = {severity}
                
                closeAlert = {()=>setShowAlert(!showAlert)}
            />
            <Spinner
                spinner = {showSpinner}
            />
        </Layout>
    </>
  );
}