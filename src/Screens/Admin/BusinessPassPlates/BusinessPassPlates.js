import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import businessPassPlateServices from "../../../services/business-pass-plates-service";
import AddBusinessPassPlates from "./AddBusinessPassPlates";
import BusinessPassPlatesView from "./BusinessPassPlatesView";
import organizationServices from "../../../services/organization-service";
import cityServices from "../../../services/city-service";

export default function BusinessPassPlates(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({});
  const [businessPassPlates, setBusinessPassPlates] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [zones, setZones] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [plates, setPlates] = useState(1)
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getOrganizations();
    getBusinessPassPlates();
  },[])

  const getZones = async(org_id)=>{
    setSpinner(true);
    const res = await cityServices.getZones({org_id: org_id});
    setZones(res.data.filter(x => x.is_business_pass))
    setSpinner(false);
  }

  const getBusinessPassPlates = async()=>{
    setSpinner(true);
    const res = await businessPassPlateServices.getBusinessPassPlates({org_id: props.org._id});
    setBusinessPassPlates(res.data)
    setSpinner(false);
  }

  const getOrganizations = async()=>{
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    if(user.result?.role !== 'root'){
      let org = res.data.filter(x=>x._id == props.org._id);
      setSelectedOrg(org[0]);
      getZones(org[0]._id);
    }
    setOrganizations(res.data)
    setSpinner(false);
  }

  const handleChange = (e) => {
    if(e.target.name == 'plate' || e.target.name == 'plate_two' || e.target.name == 'plate_three')
    e.target.value = e.target.value.toUpperCase();
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    inputField['org'] = selectedOrg._id;
    inputField['zone'] = selectedZone._id;
    inputField['city'] = selectedZone.city_id;
    inputField['tenant_and_visitor'] = selectedZone.tenant_and_visitor;
    if(btn === props.literals.add){
      const res = await businessPassPlateServices.addBusinessPassPlates(inputField);
      setMsg(props.literals[res.data?.msg]);
      setSeverity(res.data?.status);
      setAlert(true);
    }else{
      inputField['id'] = editId;
      await businessPassPlateServices.editBusinessPassPlates(inputField);
      setBtn(props.literals.add)
      setMsg(props.literals.plate_updated_successfully);
      setSeverity('success');
      setAlert(true);
    }
    getBusinessPassPlates();
    setInputField({});
    setOpenDrawer(false);
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await businessPassPlateServices.delBusinessPassPlates({id: editId});
    if(res.data.deletedCount === 1)
    setBusinessPassPlates(businessPassPlates.filter(function( obj ) {
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
    setSelectedZone(e.zone);
    let obj = {
      plate: e?.plate,
    }
    setInputField(obj);
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
      <BusinessPassPlatesView
        businessPassPlates={businessPassPlates}
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
      <AddBusinessPassPlates
        inputField={inputField}
        btn={btn}
        literals = {props.literals}
        organizations={organizations}
        selectedOrg={selectedOrg}
        zones={zones}
        selectedZone={selectedZone}
        user={user}
        plates={plates}
        
        setSelectedOrg={(e)=> {setSelectedOrg(e); getZones(e._id); setSelectedZone(null)}}
        setSelectedZone={(e)=>setSelectedZone(e)}
        handleChange={(e)=>handleChange(e)}
        handleSubmit={(e)=>handleSubmit(e)}
        onClose={()=>{setOpenDrawer(false)}}
        addPlate={()=>{setPlates(plates+1)}}
        delPlate={()=>{setPlates(plates-1)}}
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
