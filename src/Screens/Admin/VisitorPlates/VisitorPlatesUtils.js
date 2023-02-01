import React, {useState, useEffect} from "react";
import { useNavigate, useParams } from "react-router-dom";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import AddVisitorPlates from "./AddVisitorPlates";
import cityServices from "../../../services/city-service";
import plateServices from "../../../services/plate-service";

export default function VisitorPlatesUtils() {
  let navigate = useNavigate();
  let {id} = useParams();
  const [spinner, setSpinner] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [msg, setMsg] = useState('');
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [inputField, setInputField] = useState({});
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(()=>{
    getZones();
  },[])

  const getZones = async()=>{
    setSpinner(true);
    const res = await cityServices.getVisitorZone({id: id});
    if(res.data.length > 0){
      setSelectedZone(res.data[0])
      setZones(res.data)      
    }else{
      navigate()
    }
    setSpinner(false);
  }

  const handleChange = (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.value.toUpperCase()});
  }

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setSpinner(true);
    inputField["zone_type"] = 1;
    inputField["visitor_pass_time"] = selectedZone.visitor_pass_time;
    const res = await plateServices.addBusinessPlate(inputField);
    if(res.data.success !== false){
      setMsg("Plate added successfully");
      setSeverity('success');
      setAlert(true);
      inputField["plate"] = "";
      setOpenDrawer(false);
    }else{
      setMsg(res.data.msg);
      setSeverity('info');
      setAlert(true);
    }
    setSpinner(false);
  }

  return (
    <>
      <AddVisitorPlates
        zones = {zones}
        selectedZone = {selectedZone}
        openDrawer = {openDrawer}
        inputField = {inputField}

        handleChange = {(e)=>handleChange(e)}
        handleSubmit = {(e)=>handleSubmit(e)}
        setOpenDrawer = {()=> setOpenDrawer(!openDrawer)}
        setSelectedZone = {(e)=> setSelectedZone(e)}
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
