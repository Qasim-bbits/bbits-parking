import React, {useState, useEffect} from 'react';
import {Drawer} from '@mui/material';
import AddPlateForm from './addPlateForm';
import MainView from './main.view';
import ParkingRateForm from './parkingRateForm';
import SelectPlateForm from './selectPlateForm';
import {getCenterOfBounds, isPointInPolygon} from 'geolib';
import SelectTariff from './SelectTariff';
import mainService from '../../../services/main-service';
import SnackAlert from '../../../Common/Alerts';
import Spinner from '../../../Common/Spinner';
import Receipt from './receipt';
import cityServices from '../../../services/city-service';
import Moneris from './moneris';

export default function MainUtils(props) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [center,setCenter] = useState({lat: 45.35291599443195, lng: -75.5066849632779});
  const [zoom,setZoom] = useState(10);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [cityPolygon, setCityPolygon] = useState([]);
  const [selectedPlate, setSelectedPlate] = useState([]);
  const [plates, setPlates] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [drawerComponent, setDrawerComponent] = useState(0);
  const [cities, setCities] = useState([]);
  const [steps, setSteps] = useState(0);
  const [rateCycle, setRateCycle] = useState([]);
  const [stepData, setStepData] = useState([]);
  const [zones, setZones] = useState([]);
  const [inputPlateField, setInputPlateField] = useState({});
  const [btn, setBtn] = useState(props.literals.add_plate)
  const [inPolygon, setInPolygon] = useState(false);
  const [parking, setParking] = useState({})
  const [selectedTariff, setSelectedTariff] = useState({})
  const [tarif, setTarif] = useState([]);

  useEffect(()=>{
    getCities();
  },[])

  const getCities = async()=>{
    setShowSpinner(true);
    const res = await cityServices.getCities({org_id: props.org._id});
    setCities(res.data)
    setShowSpinner(false);
  }

  const toggleDrawer = ()=>setDrawer(true);

  const onSelectedCity = async(e)=>{
    setSelectedCity(e);
    setShowSpinner(true);
    setCityPolygon(e.polygon);
    setCenter(getCenterOfPolygon(e.polygon))
    // setZoom(1);
    const res = await mainService.getZonesById({id: e._id});
    setZones(res.data)
    setShowSpinner(false);
  }

  const onSelectedZone = (e)=>{
    setSelectedZone(e);
    setCenter(getCenterOfPolygon(e.polygon))
    setZoom(20);
  }

  const handleMapCenter = (center)=>{
    if(selectedZone !== null){
      const options = selectedZone.polygon.map(function(row) {
        return { latitude : row.lat, longitude : row.lng }
      })
      setInPolygon(isPointInPolygon({latitude: center.lat, longitude: center.lng}, options))
    }
  }

  const getCenterOfPolygon = (polygon) =>{
    const options = polygon.map(function(row) {
      return { latitude : row.lat, longitude : row.lng }
    })
    let center =  getCenterOfBounds(options);
    return {lat: center.latitude, lng: center.longitude};
  }

  const confirmZone=async()=>{
    if(selectedCity == null || selectedZone == null){
      setAlertMessage(props.literals.select_city_zone);
      setSeverity('error');
      setShowAlert(true);
      return;
    }
    setShowSpinner(true);
    let user = JSON.parse(sessionStorage.getItem('userLogged'));
    const res = await mainService.getPlatesByUser({id: user.result._id});
    setPlates(res.data)
    setDrawerComponent(2);
    toggleDrawer();
    setShowSpinner(false);
    setBtn(props.literals.add_plate);
  }

  const onTarifSelect = async(e)=>{
    setSteps(0);
    setShowSpinner(true);
    setSelectedTariff(e);
    const res = await mainService.getRateSteps({id: e._id, plate: selectedPlate, rate_type: e.rate_type, org: selectedZone.org})
    setRateCycle(res.data);
    if(res.data.length > 0){
      var data = res.data.map(function(item) {
        return ((item['total']/100).toFixed(2));
      });
      console.log(data);
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
    const res = await mainService.getRateById({id: selectedZone._id, plate: e});
    if(res.data.success != false){
      setTarif(res.data);
      setDrawerComponent(0);
    }else{
      setAlertMessage(res.data.msg);
      setSeverity('warning');
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
    setShowSpinner(true);
    const res = await mainService.delPlate({id: e});
    if(res.data.deletedCount === 1){
      confirmZone();
    }else{
      setAlertMessage("Unable to delete this plate");
      setSeverity("error");
      setShowAlert(true);
    }
  }

  const onPlateEdit = async(e) => {
    inputPlateField['id'] = e._id;
    inputPlateField['plate'] = e.plate;
    setDrawerComponent(1);
    setBtn(props.literals.update);
  }

  const handlePlateChange = (e) =>{
    setInputPlateField({...inputPlateField, [e.target.name] : e.target.value.toUpperCase()})
  }

  const handlePlateSubmit = async(e) =>{
    e.preventDefault();
    setShowSpinner(true);
    if(btn === props.literals.add_plate){
      let user = JSON.parse(sessionStorage.getItem('userLogged'))
      inputPlateField['user_id'] = user.result._id
      await mainService.addPlate(inputPlateField);
    }else{
      await mainService.editPlate(inputPlateField);
    }
    setShowSpinner(false);
    confirmZone();
  }

  const emailReciept = async()=>{
    setShowSpinner(true);
    const res = await mainService.emailReciept({parking_id : parking._id});
    setAlertMessage(res.data.msg);
    setSeverity(res.data.status);
    setShowAlert(true);
    setShowSpinner(false);
  }

  return (
    <>
      {cities.length > 0 && <MainView
        center = {center}
        zoom = {zoom}
        cities = {cities}
        zones = {zones}
        selectedCity = {selectedCity}
        selectedZone = {selectedZone}
        cityPolygon = {cityPolygon}
        inPolygon = {inPolygon}
        color = {props.org.color}
        org={props.org}
        literals = {props.literals}

        onSelectedCity = {(e)=>onSelectedCity(e)}
        onSelectedZone = {(e)=>onSelectedZone(e)}
        confirmZone = {()=>confirmZone()}
        handleMapCenter = {(e)=>handleMapCenter(e)}
      />}
      <Drawer
        variant='temporary'
        open={drawer}
        onClose={toggleDrawer}
        anchor='right'
        sx={{background: '#fff'}}
      >
        {drawerComponent === 0 && <SelectTariff 
          tarif = {tarif}
          literals = {props.literals}

          setDrawerOpen = {toggleDrawer}
          onTarifSelect = {(e)=>onTarifSelect(e)}
          back = {()=>setDrawerComponent(2)}
          />}
        {drawerComponent === 1 && <AddPlateForm
          setDrawerOpen = {toggleDrawer}
          inputPlateField = {inputPlateField}
          btn = {btn}
          literals = {props.literals}

          handlePlateChange = {(e)=>handlePlateChange(e)}
          handlePlateSubmit = {(e)=>handlePlateSubmit(e)}
          back = {()=>setDrawerComponent(2)}
        />}
        {drawerComponent === 2 && <SelectPlateForm 
          setDrawerOpen = {toggleDrawer}
          plates = {plates}
          literals = {props.literals}

          onPlateSelect = {(e)=>onPlateSelect(e)}
          onPlateEdit = {(e)=>onPlateEdit(e)}
          onPlateDel = {(e)=>onPlateDel(e)}
          addPlateDrawer = {()=>{setDrawerComponent(1)}}
          back = {()=>setDrawer(false)}
          />}
        {drawerComponent === 3 && rateCycle.length > 0 && <ParkingRateForm 
          steps = {steps}
          rateCycle = {rateCycle}
          user = {JSON.parse(sessionStorage.getItem('userLogged'))}
          plate = {selectedPlate}
          zone = {selectedZone._id}
          city = {selectedCity._id}
          center = {center}
          tarif = {tarif}
          selectedTariff = {selectedTariff}
          stepData = {stepData}
          org = {props.org}
          literals = {props.literals}

          showMoneris = {()=>setDrawerComponent(5)}
          setDrawerOpen={toggleDrawer} 
          handleChange = {(e)=>handleChange(e)}
          back = {()=>setDrawerComponent(0)}
          showReciept = {()=>setDrawerComponent(4)}
          setParking = {(e)=>setParking(e)}
        />}
        {drawerComponent === 5 && <Moneris
            steps = {steps}
            rateCycle = {rateCycle}
            user = {JSON.parse(sessionStorage.getItem('userLogged'))}
            plate = {selectedPlate}
            zone = {selectedZone._id}
            city = {selectedCity._id}
            center = {center}
            tarif = {tarif}
            selectedTariff = {selectedTariff}
            stepData = {stepData}
            org = {props.org}
            literals = {props.literals}
            
            setDrawerOpen = {toggleDrawer}
            showReciept = {()=>setDrawerComponent(4)}
            back = {()=>setDrawerComponent(3)}
            setParking = {(e)=>setParking(e)}
          />}
        {drawerComponent === 4 && <Receipt 
            steps = {steps}
            rateCycle = {rateCycle}
            plate = {selectedPlate}
            zone = {selectedZone}
            city = {selectedCity}
            tarif = {tarif}
            selectedTariff = {selectedTariff}
            parking = {parking}
            literals = {props.literals}
            
            setDrawerOpen = {toggleDrawer}
            emailReciept = {()=>emailReciept()}
            back = {()=>{window.location.reload()}}
          />}
      </Drawer>
      <SnackAlert
        alertMessage = {alertMessage}
        showAlert = {showAlert}
        severity = {severity}
        
        closeAlert = {()=>setShowAlert(!showAlert)}
      />
      <Spinner
        spinner = {showSpinner}
      />
    </>
  );
}