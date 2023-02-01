import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import externalParkingConfigServices from "../../../services/externalParkingConfig-service";
import AddExternalParkingConfig from "./AddExternalParkingConfig";
import ExternalParkingConfigView from "./ExternalParkingConfigView";
import organizationServices from "../../../services/organization-service";

export default function ExternalParkingConfig(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({});
  const [externalParkingConfig, setExternalParkingConfig] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [zones, setZones] = useState([])
  const [selectedZone, setSelectedZone] = useState(null)
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getOrganizations();
    getExternalParkingConfig();
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

  const getExternalParkingConfig = async()=>{
    setSpinner(true);
    const res = await externalParkingConfigServices.getExternalParkingConfig({org_id: props.org._id});
    setExternalParkingConfig(res.data)
    setSpinner(false);
  }

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const onSelectedOrg = async (e) => {
    setSelectedOrg(e);
    setSelectedZone(null);
    setSpinner(true);
    const res = await externalParkingConfigServices.getZoneByOrg({org_id: e._id});
    setZones(res.data)
    setSpinner(false);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    inputField['org'] = selectedOrg._id;
    inputField['zone'] = selectedZone._id;
    if(btn === props.literals.add){
      let res = await externalParkingConfigServices.addExternalParkingConfig(inputField);
      setMsg(props.literals[res.data.msg]);
      setSeverity(res.data.status);
      setAlert(true);
    }else{
      inputField['id'] = editId;
      let res = await externalParkingConfigServices.editExternalParkingConfig(inputField);
      setBtn(props.literals.add)
      setMsg(props.literals[res.data.msg]);
      setSeverity(res.data.status);
      setAlert(true);
    }
    getExternalParkingConfig();
    setSelectedOrg(null);
    setSelectedZone(null);
    setInputField({});
    setOpenDrawer(false);
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await externalParkingConfigServices.delExternalParkingConfig({id: editId});
    if(res.data.deletedCount === 1)
    setExternalParkingConfig(externalParkingConfig.filter(function( obj ) {
        return obj._id !== editId;
    }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.configuration_deleted_successfully)
    setSeverity('success')
    setAlert(true)
  }

  const onEdit = async(e)=> {
    setSpinner(true);
    setInputField(e);
    let org = organizations.find(x=>x._id == e.org?._id);
    setSelectedOrg(org);
    const res = await externalParkingConfigServices.getZoneByOrg({org_id: org._id});
    setZones(res.data)
    setSelectedZone(res.data.find(x=>x._id == e.zone?._id))
    setOpenDrawer(true);
    setEditId(e._id);
    setBtn(props.literals.update);
    setSpinner(false);
  }

  return (
    <>
    <ExternalParkingConfigView
      externalParkingConfig={externalParkingConfig}
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
      <AddExternalParkingConfig
        inputField={inputField}
        btn={btn}
        organizations={organizations}
        selectedOrg={selectedOrg}
        selectedZone={selectedZone}
        zones={zones}
        user={user}
        literals = {props.literals}

        setSelectedOrg={(e)=>onSelectedOrg(e)}
        setSelectedZone={(e)=>setSelectedZone(e)}
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
