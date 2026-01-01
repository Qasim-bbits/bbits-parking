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
  const PAGE_CONFIG = { pageSize: 25, page: 0 };
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState('');
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [inputField, setInputField] = useState({});
  const [parking, setParking] = useState({ data: [], pagination: { ...PAGE_CONFIG, total: 0 } });
  const [searched, setSearched] = useState("");
  const [rows, setRows] = useState([]);
  const [paramFilter, setParamFilter] = useState({});
  const [pagination, setPagintion] = useState(PAGE_CONFIG)
  const [sort, setSort] = useState({ sortBy: '_id', sort: -1 })
  const [filter, setFilter] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState('');
  const [kickOutParking, setKickOutParking] = useState({});
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [editPlateModal, setEditPlateModal] = useState(false);
  const [selectedParking, setSelectedParking] = useState({});

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
        amount: { $ne: '0' }
      }
    }else if(id === 'free'){
      body = {
        amount: '0'
      }
    }
    setParamFilter(body);
    getParkings(body, { ...PAGE_CONFIG, ...sort });
  }

  const convertObjectToQueryString = (obj) => {
    return `?${Object.keys(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join("&")}`;
  }

  const getParkings = async(e, query)=>{
    setSpinner(true);
    const queryString = convertObjectToQueryString(query);
    const res = await parkingServices.getParkings({ ...e, ...{ org: props.org._id }}, queryString);
    setParking(res.data)
    setRows(res.data);
    setSpinner(false);
  }

  const onFilter = (obj) => {
    setFilter(obj);
    let queryObj = {
      ...pagination,
      ...sort,
      ...obj,
    };
    getParkings(paramFilter, queryObj);
  }

  const onPageChange = (obj) => {
    setPagintion(obj);
    let queryObj = {
      ...filter,
      ...sort,
      ...obj,
    };
    getParkings(paramFilter, queryObj);
  }

  const onSort = (obj) => {
    setSort(obj);
    let queryObj = {
      ...filter,
      ...pagination,
      ...obj,
    };
    getParkings(paramFilter, queryObj);
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
    let body = paramFilter;
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
    if(selectedParking?.plate){
      setSpinner(true);
      await parkingService.exitParking({plate: selectedParking.plate, zone: selectedParking.zone._id});
      setSelectedParking({});
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

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value.toUpperCase() });
  };

  const handleEditPlate = async (e) => {
      e.preventDefault();
      setSpinner(true);
      const res = await parkingService.editParkingPlate({parking_id: selectedParking._id, plate: inputField.plate});
      if(res.data.status == 'error'){
        setMsg(props.literals[res.data.message]);
        setSeverity('error');
        setAlert(true);
      }else if(res.data.status == 'b_error'){
        setMsg(res.data.message);
        setSeverity('error');
        setAlert(true);
      } else{
        setMsg(props.literals.plate_edited_successfully);
        setSeverity('success');
        setAlert(true);
        setParking(parking.map(x=>{
          if(x._id == selectedParking._id){
            x.plate = inputField.plate;
            x.no_of_times_plate_edited = res.data.no_of_times_plate_edited;
          }
          return x;
        }))
        setSpinner(false);
        setEditPlateModal(false);
      }
  }

  return (
    <>
      <ParkingsView
        inputField = {inputField}        
        parking = {parking}
        searched = {searched}
        literals = {props.literals}
        editPlateModal= {editPlateModal}

        onPageChange={onPageChange}
        onFilter={onFilter}
        onSort={onSort}
        requestSearch = {(e)=>requestSearch(e)}
        handleParkings = {(e)=>handleParkings(e)}
        onResetParking = {(e)=>onResetParking(e)}
        endSession = {(e) => {setSelectedParking(e); setOpenDialog(true)}}
        conFirmKickOutPlate = {(e) => {
          setKickOutParking(e);
          setOpenDialog(true);
          setDialogTitle(props.literals.parking_already_purchased)
          setDialogContent(`Are you sure, you want to kick out this ${e.plate} plate`)
        }}
        kickOutPlate = {(e) => kickOutPlate(e)}
        openEditPlateModal = {(e)=>{setSelectedParking(e); setEditPlateModal(true)}}
        closeEditPlateModal = {()=>setEditPlateModal(false)}
        handleChange={(e)=>handleChange(e)}
        handleEditPlate={(e)=>handleEditPlate(e)}
        setSpinner={(e) => setSpinner(e)}
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
