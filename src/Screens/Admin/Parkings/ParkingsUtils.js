import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ParkingsView from "./ParkingsView";
import parkingServices from "../../../services/parking-service";
import parkingService from "../../../services/parking-service";
import ConfirmEndSessionDiallog from "../../../shared/ConfirmEndSessionDiallog";
const moment = require('moment-timezone');
moment.tz.setDefault("America/New_York");

export default function ParkingsUtils(props) {
  let {id} = useParams();
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState('');
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [inputField, setInputField] = useState({});
  const [parking, setParking] = useState([]);
  const [searched, setSearched] = useState("");
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState('');
  const [kickOutParking, setKickOutParking] = useState({});
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');

  useEffect(()=>{
    getFilter();
  },[id])

  const getFilter = async()=>{
    let body = {};
    if(id === 'current'){
      body = {
        from: {$lte: new Date()},
        to: {$gte: new Date()}
      }
    }else if(id === 'all'){
      body = {}
    }else if(id === 'paid'){
      body = {
        service_fee: { $ne: '0' }
      }
    }else if(id === 'free'){
      body = {
        service_fee: '0'
      }
    }
    setFilter(body);
    getParkings(body);
  }

  const getParkings = async(e)=>{
    setSpinner(true);
    const res = await parkingServices.getParkings({...e, ...{org: props.org._id}});
    setParking(res.data)
    setRows(res.data);
    setSpinner(false);
  }

  const requestSearch = (searchedVal) => {
    const filteredRows = rows.filter((row) => {
      return row.zone?.zone_name.toLowerCase().includes(searchedVal.toLowerCase()) 
      || row.parking_id.toString().includes(searchedVal)
      || row.city?.city_name.toLowerCase().includes(searchedVal.toLowerCase())
      || row.user?.fname.toLowerCase().includes(searchedVal.toLowerCase())
      || row.user?.email.toLowerCase().includes(searchedVal.toLowerCase())
      || row.plate.toLowerCase().includes(searchedVal.toLowerCase())
      || ((row.amount/100).toFixed(2)).toString().toLowerCase().includes(searchedVal.toLowerCase())
      || (moment(row.from).format('ll hh:mm a')).toLowerCase().includes(searchedVal.toLowerCase())
      || (moment(row.to).format('ll hh:mm a')).toLowerCase().includes(searchedVal.toLowerCase())
    });
    setSearched(searchedVal);
    setParking(filteredRows);
};

const handleParkings = (e)=>{
  console.log(filter);
  let body = filter;
  body["parking_type"] = e;
  getParkings(body);
}

const onResetParking = async (e)=>{
  let body = {
    zone: e.zone,
    plate: e.plate
  }
  setSpinner(true);
  await parkingServices.resetParkingLimit(body);
  setMsg(props.literals.parking_limit_reset_successfully);
  setSeverity('success');
  setAlert(true);
  setSpinner(false);
}

  const endSession = async (e) => {
    if(editId){
      setSpinner(true);
      await parkingService.editParking({id: editId, to: moment().toDate()});
      setEditId('');
      setMsg(props.literals.session_end_successfully);
      setSeverity('success');
      setAlert(true);
      setOpenDialog(false);
      getFilter();
      setSpinner(false);
    }else{
      kickOutPlate();
    }
  }

  const kickOutPlate = async () =>{
    let user = JSON.parse(sessionStorage.getItem("userLogged"));
    let body = {
      zone: kickOutParking.zone._id,
      city: kickOutParking.city._id,
      org: kickOutParking.org._id,
      parking: kickOutParking._id,
      kicked_out_plate: kickOutParking.plate,
      kicked_out_By: user.result.email
    }
    setSpinner(true);
    await parkingServices.kickOutPlate(body);
    setMsg(props.literals.plate_kickout_purchase_now);
    setSeverity('success');
    setAlert(true);
    setSpinner(false);
    setOpenDialog(false);
  }

  return (
    <>
      <ParkingsView
        inputField = {inputField}        
        parking = {parking}
        searched = {searched}
        literals = {props.literals}

        requestSearch = {(e)=>requestSearch(e)}
        handleParkings = {(e)=>handleParkings(e)}
        onResetParking = {(e)=>onResetParking(e)}
        endSession = {(e) => {setEditId(e._id); setOpenDialog(true)}}
        conFirmKickOutPlate = {(e) => {
          setKickOutParking(e);
          setOpenDialog(true);
          setDialogTitle(props.literals.parking_already_purchased)
          setDialogContent(`Are you sure, you want to kick out this ${e.plate} plate`)
        }}
        kickOutPlate = {(e) => kickOutPlate(e)}
      />
      <SnackAlert
        msg = {msg}
        alert = {alert}
        severity = {severity}
        
        closeAlert = {()=>setAlert(!alert)}
      />
      <Spinner
        spinner = {spinner}
      />
      <ConfirmEndSessionDiallog
        openDialog = {openDialog}
        dialogTitle = {dialogTitle}
        dialogContent = {dialogContent}

        closeDialog = {()=>setOpenDialog(false)}
        delItem = {()=>endSession()}
      />
    </>
  );
}
