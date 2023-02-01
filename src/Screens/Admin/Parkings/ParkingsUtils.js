import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ParkingsView from "./ParkingsView";
import parkingServices from "../../../services/parking-service";
import moment from 'moment';

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

  return (
    <>
      <ParkingsView
        inputField = {inputField}        
        parking = {parking}
        searched = {searched}
        literals = {props.literals}

        requestSearch = {(e)=>requestSearch(e)}
        handleParkings = {(e)=>handleParkings(e)}
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
    </>
  );
}
