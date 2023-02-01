import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import tenentPlateServices from "../../../services/tenent-plates-service";
import AddTenentPlates from "./AddTenentPlates";
import TenentPlatesView from "./TenentPlatesView";
import organizationServices from "../../../services/organization-service";
import cityServices from "../../../services/city-service";

export default function TenentPlates(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({});
  const [tenantPlates, setTenantPlates] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [zones, setZones] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getOrganizations();
    getTenantPlates();
    getZones();
  },[])

  const getZones = async()=>{
    setSpinner(true);
    const res = await cityServices.getZones({org_id: props.org._id});
    setZones(res.data)
    setSpinner(false);
  }

  const getTenantPlates = async()=>{
    setSpinner(true);
    const res = await tenentPlateServices.getTenantPlates({org_id: props.org._id});
    setTenantPlates(res.data)
    setSpinner(false);
  }

  const getOrganizations = async()=>{
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    if(user.result?.role !== 'root'){
      let org = res.data.filter(x=>x._id == props.org._id);
      setSelectedOrg(org[0]);
    }
    setOrganizations(res.data)
    setSpinner(false);
  }

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    inputField['org'] = selectedOrg._id;
    inputField['zone'] = selectedZone._id;
    if(btn === props.literals.add){
      const res = await tenentPlateServices.addTenentPlate(inputField);
      console.log(res.data)
      setMsg(props.literals[res.data.msg]);
      setSeverity(res.data.status);
      setAlert(true);
    }else{
      inputField['id'] = editId;
      await tenentPlateServices.editTenentPlate(inputField);
      setBtn(props.literals.add)
      setMsg(props.literals.plate_updated_successfully);
      setSeverity('success');
      setAlert(true);
    }
    getTenantPlates();
    setInputField({});
    setOpenDrawer(false);
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await tenentPlateServices.delTenentPlate({id: editId});
    if(res.data.deletedCount === 1)
    setTenantPlates(tenantPlates.filter(function( obj ) {
        return obj._id !== editId;
    }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.plate_deleted_successfuly)
    setSeverity('success')
    setAlert(true)
  }

  const onEdit = async(e)=> {
    let org = organizations.find(x=>x._id == e.org._id);
    setSelectedOrg(org);
    let zone = zones.find(x=>x._id == e.zone._id);
    setSelectedZone(zone);
    setInputField(e);
    setOpenDrawer(true);
    setEditId(e._id);
    setBtn(props.literals.update);
  }

  const reset = ()=>{
    setInputField({});
    setBtn(props.literals.add);
  }

  return (
    <>
    <TenentPlatesView
      tenantPlates={tenantPlates}
      literals={props.literals}

      onEdit={(e)=>onEdit(e)}
      delItem={(id) => {setEditId(id); setOpenDialog(true)}}
      setOpenDrawer={()=>{setOpenDrawer(!openDrawer); reset()}}
      reset={()=>reset()}
    />
    <Drawer
      PaperProps={{
        sx: {
          backgroundColor: "#fff !important",
          width:
            window.innerWidth > 700
              ? "45% !important"
              : "100% !important",
        },
      }}
      anchor={'right'}
      open={openDrawer}
      onClose={()=>setOpenDrawer(false)}
    >
      <AddTenentPlates
        inputField={inputField}
        btn={btn}
        literals = {props.literals}
        organizations={organizations}
        selectedOrg={selectedOrg}
        zones={zones}
        selectedZone={selectedZone}
        user={user}
        
        setSelectedOrg={(e)=>setSelectedOrg(e)}
        setSelectedZone={(e)=>setSelectedZone(e)}
        handleChange={(e)=>handleChange(e)}
        handleSubmit={(e)=>handleSubmit(e)}
        onClose={()=>{setOpenDrawer(false)}}
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
