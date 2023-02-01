import React, {useState, useEffect} from 'react';
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

export default function QRCodeUtils(props) {
  let navigate = useNavigate();
  let {id} = useParams();
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

  useEffect(()=>{
    getZonebyId();
    confirmZone();
  },[props.apiCalled])

  const getZonebyId = async()=>{
    if(props.apiCalled){
      setShowSpinner(true);
      const res = await mainService.getZonebyId({id: id, org_id: props.org._id});
      setZones(res.data)
      if(res.data.length == 0){
        navigate(router.login)
      }
      setShowSpinner(false);
    }
  }

  const confirmZone=async()=>{
    setShowSpinner(true);
    let plate = JSON.parse(localStorage.getItem('plates'));
    if(plate !== null){
      setPlates(plate)
    }
    setShowSpinner(false);
    setDrawerComponent(2);
    setBtn(props.literals.add_plate);
  }

  const onTarifSelect = async(e)=>{
    setSteps(0);
    setShowSpinner(true);
    setSelectedTariff(e);
    const res = await mainService.getRateSteps({id: e._id, plate: selectedPlate, rate_type: e.rate_type, qr_code: e.qr_code, org: zones[0].org._id})
    setRateCycle(res.data);
    if(res.data.length > 0){
      var data = res.data.map(function(item) {
        return ((item['total']/100).toFixed(2));
      });
      setStepData(data)
      setDrawerComponent(3);
    }else{
      setAlertMessage(res.data.msg);
      setSeverity("error");
      setShowAlert(true);
    }
    setShowSpinner(false);
  }

  const onPlateSelect = async(e)=>{
    setSelectedPlate(e);
    setShowSpinner(true);
    const res = await mainService.getRateById({id: zones[0]._id, plate: e});
    if(res.data.success != false){
      setTarif(res.data);
      setDrawerComponent(0);
    }else{
      setAlertMessage(res.data.msg);
      setSeverity('info');
      setShowAlert(true);
    }
    setShowSpinner(false);
  }

  const handleChange = (value) => {
    var factor = 100;
    var number = value;
    var b = number.toString().split('.'); 
    var answer = (b[1] !== undefined) ? b[0]*factor+b[1]*(factor/(Math.pow(10,b[1].length))) : 0;
    let index = rateCycle.findIndex( x => x.total === answer );
    setSteps(index);
  };

  const onPlateDel = async(e) => {
    let plate = JSON.parse(localStorage.getItem('plates'));
    plate.splice(e, 1)
    localStorage.setItem('plates', JSON.stringify(plate));
    confirmZone();
  }

  const onPlateEdit = async(plate, index) => {
    inputPlateField['id'] = index;
    inputPlateField['plate'] = plate;
    setDrawerComponent(1);
    setBtn(props.literals.update);
  }

  const handlePlateChange = (e) =>{
    setInputPlateField({...inputPlateField, [e.target.name] : e.target.value.toUpperCase()})
  }

  const handlePlateSubmit = async(e) =>{
    e.preventDefault();
    setShowSpinner(true);
    if(btn == props.literals.add_plate){
      let plate = JSON.parse(localStorage.getItem('plates'));
      if(plate !== null){
        plate.push(inputPlateField['plate'].toUpperCase())
        localStorage.setItem('plates', JSON.stringify(plate));
      }else{
        plate = [];
        plate.push(inputPlateField['plate'].toUpperCase())
        localStorage.setItem('plates', JSON.stringify(plate));
      }
    }else{
      let plate = JSON.parse(localStorage.getItem('plates'));
      plate[inputPlateField.id] = inputPlateField.plate.toUpperCase()
      localStorage.setItem('plates', JSON.stringify(plate));
    }
    setShowSpinner(false);
    confirmZone();
  }

  return (
    <>
      <Layout org={props.org} literals = {props.literals}>
        {drawerComponent === 0 && <SelectTariff 
          tarif = {tarif}
          literals = {props.literals}

          onTarifSelect = {(e)=>onTarifSelect(e)}
          back = {()=>setDrawerComponent(2)}
          />}
        {drawerComponent === 1 && <AddPlateForm
          inputPlateField = {inputPlateField}
          btn = {btn}
          literals = {props.literals}

          handlePlateChange = {(e)=>handlePlateChange(e)}
          handlePlateSubmit = {(e)=>handlePlateSubmit(e)}
          back = {()=>setDrawerComponent(2)}
        />}
        {drawerComponent === 2 && <SelectPlateForm 
          plates = {plates}
          literals = {props.literals}

          onPlateSelect = {(e)=>onPlateSelect(e)}
          onPlateEdit = {(e, index)=>onPlateEdit(e, index)}
          onPlateDel = {(e)=>onPlateDel(e)}
          addPlateDrawer = {()=>{setDrawerComponent(1)}}
          />}
        {drawerComponent === 3 && rateCycle.length > 0 && <ParkingRateForm 
          steps = {steps}
          rateCycle = {rateCycle}
          plate = {selectedPlate}
          zone = {zones[0]._id}
          city = {zones[0].city_id}
          tarif = {tarif}
          selectedTariff = {selectedTariff}
          stepData = {stepData}
          org = {props.org}
          literals = {props.literals}

          handleChange = {(e)=>handleChange(e)}
          back = {()=>setDrawerComponent(0)}
          showReciept = {()=>setDrawerComponent(4)}
          showMoneris = {()=>setDrawerComponent(5)}
          setParking = {(e)=>setParking(e)}
          />}
          {drawerComponent === 5 && <Moneris
            steps = {steps}
            rateCycle = {rateCycle}
            user = {JSON.parse(sessionStorage.getItem('userLogged'))}
            plate = {selectedPlate}
            zone = {zones[0]._id}
            city = {zones[0].city_id}
            tarif = {tarif}
            selectedTariff = {selectedTariff}
            stepData = {stepData}
            org = {props.org}
            
            showReciept = {()=>setDrawerComponent(4)}
            back = {()=>setDrawerComponent(3)}
            setParking = {(e)=>setParking(e)}
          />}
        {drawerComponent === 4 && <Receipt 
            steps = {steps}
            rateCycle = {rateCycle}
            plate = {selectedPlate}
            zone = {zones[0]}
            tarif = {tarif}
            selectedTariff = {selectedTariff}
            parking = {parking}
            literals = {props.literals}

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