import React, { useState, useEffect } from 'react';
import AddPlateForm from './addPlateForm';
import ParkingRateForm from './parkingRateForm';
import SelectPlateForm from './selectPlateForm';
import SelectTariff from './SelectTariff';
import mainService from '../../../services/main-service';
import SnackAlert from '../../../Common/Alerts';
import Spinner from '../../../Common/Spinner';
import Receipt from './receipt';
import { Layout } from '../../../components/SidebarHeaderWrapper';
import { useNavigate, useParams } from 'react-router-dom';
import { router } from '../../../Routes/routhPaths';
import Moneris from '../Main/moneris';
import moment from 'moment';
import helpers from '../../../Helpers/Helpers';
import ParkingManagement from './parkingManagement';
import PlateConfirmation from './plateConfirmation';
import NotRegisteredError from './notRegisteredError';
import parkingService from '../../../services/parking-service';
import RegisteredSuccessful from './registeredSuccessful';
import SessionEnd from './sessionEnd';

export default function QRCodeUtils(props) {
  let navigate = useNavigate();
  let { id } = useParams();
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [selectedPlate, setSelectedPlate] = useState([]);
  const [plates, setPlates] = useState([]);
  const [drawerComponent, setDrawerComponent] = useState(2);
  const [steps, setSteps] = useState(0);
  const [rateCycle, setRateCycle] = useState([]);
  const [zones, setZones] = useState([]);
  const [inputPlateField, setInputPlateField] = useState({});
  const [btn, setBtn] = useState(props.literals.add_plate)
  const [parking, setParking] = useState({})
  const [tarif, setTarif] = useState([])
  const [stepData, setStepData] = useState([]);
  const [selectedTariff, setSelectedTariff] = useState({})
  const [inputField, setInputField] = useState({});
  const [openCustomRateModal, setOpenCustomRateModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [isExitParking, setIsExitParking] = useState(false);
  const [isSessionEnd, setIsSessionEnd] = useState(false);

  useEffect(() => {
    getZonebyId();
    confirmZone();
  }, [props.apiCalled])

  const getZonebyId = async () => {
    if (props.apiCalled) {
      setShowSpinner(true);
      const res = await mainService.getZonebyId({ id: id, org_id: props.org._id });
      setZones(res.data)
      if (res.data.length == 0) {
        navigate(router.login)
      }
      setShowSpinner(false);
    }
  }

  const handleCheck = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.checked });
  };

  const confirmZone = async () => {
    setShowSpinner(true);
    let plate = JSON.parse(localStorage.getItem('plates'));
    if (plate !== null) {
      setPlates(plate)
    }
    setShowSpinner(false);
    if(!zones[0]?.is_business_pass){
      setDrawerComponent(2);
      setBtn(props.literals.add_plate);
    }
  }

  const onTarifSelect = async (e) => {
    setSteps(0);
    setShowSpinner(true);
    setSelectedTariff(e);
    const res = await mainService.getRateSteps({ id: e._id, plate: selectedPlate, rate_type: e.rate_type, qr_code: e.qr_code, org: zones[0].org._id, time_zone: zones[0].city_id.time_zone })
    setRateCycle(res.data);
    if (res.data.length > 0) {
      var data = res.data.map(function (item) {
        return ((item['total'] / 100).toFixed(2));
      });
      setStepData(data)
      if(!zones[0]?.is_business_pass)
        setDrawerComponent(3);
      else{
        purchaseParking(res.data[0]);
      }
    } else {
      setAlertMessage(res.data.msg);
      setSeverity("error");
      setShowAlert(true);
    }
    setShowSpinner(false);
  }

  const onPlateSelect = async (e) => {
    setSelectedPlate(e);
    setShowSpinner(true);
    const res = await mainService.getRateById({ id: zones[0]._id, plate: e });
    if (res.data.success != false) {
      setTarif(res.data);
      if(res.data.length == 1)
        onTarifSelect(res.data[0]);
      else
        setDrawerComponent(0);
    } else {
      if(res.data.msg == 'plate_not_register_as_employee'){
        setDrawerComponent(6);
      }else{
        setAlertMessage(res.data.msg);
        setSeverity('info');
        setShowAlert(true);
      }
    }
    setShowSpinner(false);
  }

  const handleChange = (value) => {
    // console.log(value)
    // var factor = 100;
    // var number = value;
    // var b = number.toString().split('.'); 
    // var answer = (b[1] !== undefined) ? b[0]*factor+b[1]*(factor/(Math.pow(10,b[1].length))) : 0;
    // let index = rateCycle.findIndex( x => x.total === answer );
    // console.log(index)
    setSteps(value);
  };

  const onPlateDel = async (e) => {
    let plate = JSON.parse(localStorage.getItem('plates'));
    plate.splice(e, 1)
    localStorage.setItem('plates', JSON.stringify(plate));
    confirmZone();
  }

  const onPlateEdit = async (plate, index) => {
    inputPlateField['id'] = index;
    inputPlateField['plate'] = plate;
    setDrawerComponent(1);
    setBtn(props.literals.update);
  }

  const handlePlateChange = (e) => {
    setInputPlateField({ ...inputPlateField, [e.target.name]: e.target.value.toUpperCase() })
  }

  const handlePlateSubmit = async (e) => {
    e.preventDefault();
    setShowSpinner(true);
    let plate = JSON.parse(localStorage.getItem('plates'));
    // if (plate && plate.find(x => x == inputPlateField['plate'].toUpperCase())) {
    //   setAlertMessage('Plate already exists');
    //   setSeverity('error');
    //   setShowAlert(true);
    //   setShowSpinner(false);
    //   return;
    // }
    if (btn == props.literals.add_plate) {
      if (plate !== null) {
        plate.push(inputPlateField['plate'].toUpperCase())
        localStorage.setItem('plates', JSON.stringify(plate));
      } else {
        plate = [];
        plate.push(inputPlateField['plate'].toUpperCase())
        localStorage.setItem('plates', JSON.stringify(plate));
      }
    } else {
      plate[inputPlateField.id] = inputPlateField.plate.toUpperCase()
      localStorage.setItem('plates', JSON.stringify(plate));
    }
    setShowSpinner(false);
    confirmZone();
    if(isExitParking)
      endSession();
    else
      onPlateSelect(inputPlateField.plate.toUpperCase());
  }

  const handleCustomRate = (customRate) => {
    const customRateInMin = customRate * 24 * 60;
    const customRateAmount = rateCycle[0].rate / rateCycle[0].time * customRateInMin;
    const timeDesc = moment(rateCycle[0].current_time, 'MMMM Do YYYY, hh:mm a').add(customRateInMin, 'minutes').format('MMMM Do YYYY, hh:mm a');
    let customRateCycle = {
      time: customRateInMin,
      rate: customRateAmount,
      time_desc: timeDesc,
      time_diff: helpers.showDiff(timeDesc),
      day: helpers.calculateDay(moment(timeDesc, 'MMMM Do YYYY, hh:mm a').format()),
      service_fee: rateCycle[0].service_fee,
      total: customRateAmount + rateCycle[0].service_fee,
      current_time: rateCycle[0].current_time
    };
    let allSteps = [...rateCycle, customRateCycle];
    setRateCycle(allSteps)
    handleChange(allSteps.length - 1);
    setOpenCustomRateModal(false);
    setShowPayment(false);
  }

  const showPlateConfirmation = (e) => {
    setIsExitParking(e)
    let plate = JSON.parse(localStorage.getItem('plates'));
    if(plate)
      onPlateEdit(plate[0], 0);
    else
      setDrawerComponent(1);
  }

  const purchaseParking= async (cycle)=>{
    setShowSpinner(true);
    if(cycle.rate == 0){
      let body = {
        paymentMethod: '',
        amount: (cycle.total/100).toFixed(2),
        plate: inputPlateField.plate.toUpperCase(),
        // user: '',
        zone: zones[0]._id,
        city: zones[0].city_id,
        from: cycle.current_time,
        to: cycle.time_desc,
        coord: '',
        rate: selectedTariff._id,
        service_fee: cycle.service_fee,
        org: props.org._id
      }
      const res = await parkingService.buyParking(body);
      setShowSpinner(false);
      if(!res.data.message){
        setDrawerComponent(7);
        setZones([
          { ...zones[0], available_passes: zones[0].available_passes - 1}
        ]);
        setParking(res.data)
        sessionStorage.removeItem("showParking");
        localStorage.setItem('parkedPlate', JSON.stringify(res.data));
      }else{
        setAlertMessage(res.data.message);
        setSeverity('error');
        setShowAlert(true);
      }
    }
  }

  const endSession = async () => {
    setShowSpinner(true);
    const res = await parkingService.exitParking({plate: inputPlateField.plate.toUpperCase(), zone: zones[0]._id});
    if(res.data.status == 'success'){
      setZones([
        { ...zones[0], available_passes: zones[0].available_passes + 1}
      ]);
      setIsSessionEnd(true);
    }
    else
      setIsSessionEnd(false);
    setDrawerComponent(8)
    localStorage.removeItem('parkedPlate');
    setShowSpinner(false);
  }

  return (
    <>
      <Layout org={props.org} literals={props.literals}>
        {zones.length && !zones[0]?.is_business_pass && <>
          {drawerComponent === 0 && <SelectTariff
            tarif={tarif}
            literals={props.literals}
            caption_en={zones[0].caption_en}
            caption_fr={zones[0].caption_fr}
            inputField={inputField}

            handleCheck={(e) => handleCheck(e)}
            handleChange={(e) => handleChange(e)}
            onTarifSelect={(e) => onTarifSelect(e)}
            back={() => setDrawerComponent(2)}
          />}
          {drawerComponent === 1 && <AddPlateForm
            inputPlateField={inputPlateField}
            btn={btn}
            literals={props.literals}

            handlePlateChange={(e) => handlePlateChange(e)}
            handlePlateSubmit={(e) => handlePlateSubmit(e)}
            back={() => setDrawerComponent(2)}
          />}
          {drawerComponent === 2 && <SelectPlateForm
            plates={plates}
            literals={props.literals}

            onPlateSelect={(e) => onPlateSelect(e)}
            onPlateEdit={(e, index) => onPlateEdit(e, index)}
            onPlateDel={(e) => onPlateDel(e)}
            addPlateDrawer={() => { setDrawerComponent(1) }}
          />}
          {drawerComponent === 3 && rateCycle.length > 0 && <ParkingRateForm
            steps={steps}
            rateCycle={rateCycle}
            plate={selectedPlate}
            zone={zones[0]._id}
            city={zones[0].city_id}
            tarif={tarif}
            selectedTariff={selectedTariff}
            stepData={stepData}
            org={props.org}
            literals={props.literals}
            customRateModal={openCustomRateModal}
            showPayment={showPayment}

            setShowPayment={(e) => setShowPayment(e)}
            closeCustomRateModal={() => setOpenCustomRateModal(false)}
            openCustomRateModal={() => setOpenCustomRateModal(true)}
            handleCustomRate={(e) => handleCustomRate(e)}
            back={() => setDrawerComponent(0)}
            showReciept={() => setDrawerComponent(4)}
            showMoneris={() => setDrawerComponent(5)}
            handleChange={(e) => handleChange(e)}
            setParking={(e) => setParking(e)}
          />}
          {drawerComponent === 5 && <Moneris
            steps={steps}
            rateCycle={rateCycle}
            user={JSON.parse(sessionStorage.getItem('userLogged'))}
            plate={selectedPlate}
            zone={zones[0]._id}
            city={zones[0].city_id}
            tarif={tarif}
            selectedTariff={selectedTariff}
            stepData={stepData}
            org={props.org}

            showReciept={() => setDrawerComponent(4)}
            back={() => setDrawerComponent(3)}
            setParking={(e) => setParking(e)}
          />}
          {drawerComponent === 4 && <Receipt
            steps={steps}
            rateCycle={rateCycle}
            plate={selectedPlate}
            zone={zones[0]}
            tarif={tarif}
            selectedTariff={selectedTariff}
            parking={parking}
            literals={props.literals}

          />}
        </>}
        {zones[0]?.is_business_pass && <>
          {drawerComponent === 2 && <ParkingManagement
            plates={plates}
            literals={props.literals}
            zone={zones[0]}
            
            showPlateConfirmation={() => showPlateConfirmation(false)}
            endSession={() => showPlateConfirmation(true)}
          />}
          {drawerComponent === 1 && <PlateConfirmation
            inputPlateField={inputPlateField}
            literals={props.literals}
            zone={zones[0]}

            handlePlateChange={(e) => handlePlateChange(e)}
            handlePlateSubmit={(e) => handlePlateSubmit(e)}
            back={() => setDrawerComponent(2)}
          />}
          {drawerComponent === 6 && <NotRegisteredError
            literals={props.literals}
            zone={zones[0]}

            continue={() => setDrawerComponent(2)}
            back={() => setDrawerComponent(1)}
          />}
          {drawerComponent === 7 && <RegisteredSuccessful
            literals={props.literals}
            zone={zones[0]}

            continue={() => setDrawerComponent(2)}
            back={() => setDrawerComponent(2)}
          />}
          {drawerComponent === 8 && <SessionEnd
            literals={props.literals}
            zone={zones[0]}
            isSessionEnd={isSessionEnd}

            continue={() => setDrawerComponent(2)}
            back={() => isSessionEnd ? setDrawerComponent(2) : setDrawerComponent(1)}
          />}
        </>}
        <SnackAlert
          alertMessage={alertMessage}
          showAlert={showAlert}
          severity={severity}

          closeAlert={() => setShowAlert(!showAlert)}
        />
        <Spinner
          spinner={showSpinner}
        />
      </Layout>
    </>
  );
}