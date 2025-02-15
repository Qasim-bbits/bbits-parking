import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import cityServices from "../../../services/city-service";
import AddCity from "./AddCity";
import CitiesView from "./CitiesView";
import organizationServices from "../../../services/organization-service";

export default function Cities(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({});
  const [center, setCenter] = useState({lat: 45.35291599443195, lng: -75.5066849632779});
  const [zoom, setZoom] = useState(12);
  const [polygon, setPolygon] = useState([])
  const [cities, setCities] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedTimeZone, setSelectedTimeZone] = useState(null)
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getOrganizations();
    getCities();
  },[])

  const getOrganizations = async()=>{
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    if(user.result?.role !== 'root'){
      let org = res.data.filter(x=>x._id == props.org._id);
      setSelectedOrg(org[0])
    }
    setOrganizations(res.data)
    setSpinner(false);
  }

  const getCities = async()=>{
    setSpinner(true);
    const res = await cityServices.getCities({org_id: props.org._id});
    setCities(res.data)
    setSpinner(false);
  }

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(polygon.length === 0){
      setMsg(props.literals.please_draw_polygon);
      setSeverity('error');
      setAlert(true);
      return;
    }
    setSpinner(true);
    inputField['polygon'] = polygon;
    inputField['org'] = selectedOrg._id;
    inputField['time_zone'] = selectedTimeZone;
    if(btn === props.literals.add){
      await cityServices.addCity(inputField);
      setMsg(props.literals.city_added_successfully);
      setSeverity('success');
      setAlert(true);
    }else{
      inputField['id'] = editId;
      await cityServices.editCity(inputField);
      setBtn(props.literals.add)
      setMsg(props.literals.city_updated_successfully);
      setSeverity('success');
      setAlert(true);
    }
    getCities();
    setInputField({});
    setPolygon([]);
    setOpenDrawer(false);
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await cityServices.delCity({id: editId});
    if(res.data.deletedCount === 1)
    setCities(cities.filter(function( obj ) {
        return obj._id !== editId;
    }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.city_deleted_successfuly)
    setSeverity('success')
    setAlert(true)
  }

  const onEdit = async(e)=> {
    setSelectedOrg(e.org);
    setSelectedTimeZone(e.time_zone)
    inputField["city_name"] = e.city_name;
    setOpenDrawer(true);
    setPolygon(e.polygon);
    setCenter(e.polygon[0]);
    setZoom(10);
    setEditId(e._id);
    setBtn(props.literals.update);
  }

  return (
    <>
    <CitiesView
      cities={cities}
      literals = {props.literals}

      onEdit={(e)=>onEdit(e)}
      delItem={(id) => {setEditId(id); setOpenDialog(true)}}
      setOpenDrawer={()=>setOpenDrawer(!openDrawer)}
    />
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: "#fff !important",
          width:
            window.innerWidth > 700
              ? "50% !important"
              : "100% !important",
        },
      }}
      anchor={'right'}
      open={openDrawer}
      onClose={()=>setOpenDrawer(false)}
    >
      <AddCity
        center={center}
        zoom={zoom}
        polygon={polygon}
        inputField={inputField}
        btn={btn}
        organizations={organizations}
        selectedOrg={selectedOrg}
        selectedTimeZone={selectedTimeZone}
        user={user}
        literals = {props.literals}

        setSelectedOrg={(e)=>setSelectedOrg(e)}
        setSelectedTimeZone={(e)=>setSelectedTimeZone(e)}
        setPolygon={(e)=>setPolygon(e)}
        setCenter={(e)=>setCenter(e)}
        setZoom={(e)=>setZoom(e)}
        handleChange={(e)=>handleChange(e)}
        handleSubmit={(e)=>handleSubmit(e)}
        onClose={()=>setOpenDrawer(false)}
      />
      </Drawer>

      <SnackAlert
        msg = {msg}
        alert = {alert}
        severity = {severity}
        
        closeAlert = {()=>setAlert(!alert)}
      />
      <Spinner
        spinner = {spinner}
      />
      <ConfirmDiallog
        openDialog = {openDialog}

        closeDialog = {()=>setOpenDialog(false)}
        delItem = {()=>delItem()}
      />
    </>
  );
}
