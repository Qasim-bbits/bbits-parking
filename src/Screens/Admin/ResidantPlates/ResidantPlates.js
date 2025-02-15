import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import residantPlateServices from "../../../services/residant-plates-service";
import AddResidantPlates from "./AddResidantPlates";
import ResidantPlatesView from "./ResidantPlatesView";
import organizationServices from "../../../services/organization-service";
import cityServices from "../../../services/city-service";

export default function ResidantPlates(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({});
  const [residantPlates, setResidantPlates] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [zones, setZones] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedZone, setSelectedZone] = useState([])
  const [plates, setPlates] = useState(1)
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getOrganizations();
    getResidantPlates();
  },[])

  const getZones = async(org)=>{
    setSpinner(true);
    const res = await cityServices.getZones({org_id: org._id});
    setZones(res.data)
    setSpinner(false);
  }

  const getResidantPlates = async()=>{
    setSpinner(true);
    const res = await residantPlateServices.getResidantPlates({org_id: props.org._id});
    setResidantPlates(res.data)
    setSpinner(false);
  }

  const getOrganizations = async()=>{
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    if(user.result?.role !== 'root'){
      let org = res.data.filter(x=>x._id == props.org._id);
      setSelectedOrg(org[0]);
      getZones(org[0]);
    }
    setOrganizations(res.data)
    setSpinner(false);
  }

  const onSelectedOrg = async(e)=>{
    setSelectedOrg(e);
    getZones(e)
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
    inputField['zone'] = selectedZone;
    // inputField['city'] = selectedZone.city_id;
    // inputField['tenant_and_visitor'] = selectedZone.tenant_and_visitor;
    if(btn === props.literals.add){
      const res = await residantPlateServices.addResidantPlate(inputField);
      setMsg(props.literals[res.data?.msg]);
      setSeverity(res.data?.status);
      setAlert(true);
    }else{
      inputField['id'] = editId;
      await residantPlateServices.editResidantPlate(inputField);
      setBtn(props.literals.add)
      setMsg(props.literals.plate_updated_successfully);
      setSeverity('success');
      setAlert(true);
    }
    getResidantPlates();
    setInputField({});
    setOpenDrawer(false);
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await residantPlateServices.delResidantPlate({id: editId});
    if(res.data.deletedCount === 1)
    setResidantPlates(residantPlates.filter(function( obj ) {
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
    getZones(e.org);
    // let zone = zones.find(x=>x._id == e.zone._id);
    setSelectedZone(e.zone);
    let obj = {
      fname: e.user?.fname,
      lname: e.user?.lname,
      address: e.user?.address,
      unit: e.user?.unit,
      email: e.user?.email,
      no_of_visitors: e.user?.no_of_visitors,
      mobile_no: e.user?.mobile_no,
      plate: e?.plate,
      car_make: e?.car_make,
      model: e?.model,
      color: e?.color,
      plate_two: e.plate_two,
      car_make_two: e?.car_make_two,
      model_two: e?.model_two,
      color_two: e?.color_two,
      plate_three: e.plate_three,
      car_make_three: e?.car_make_three,
      model_three: e?.model_three,
      color_three: e?.color_three,
      user: e.user?._id,
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
      <ResidantPlatesView
        residantPlates={residantPlates}
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
      <AddResidantPlates
        inputField={inputField}
        btn={btn}
        literals = {props.literals}
        organizations={organizations}
        selectedOrg={selectedOrg}
        zones={zones}
        selectedZone={selectedZone}
        user={user}
        plates={plates}
        
        setSelectedOrg={(e)=>onSelectedOrg(e)}
        setSelectedZone={(e)=>{setSelectedZone(e);console.log(selectedZone)}}
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
