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
import rateServices from "../../../services/rate-service";
import mainService from "../../../services/main-service";
import parkingService from "../../../services/parking-service";

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
  const [rates, setRates] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [selectedRate, setSelectedRate] = useState(null)
  const [plates, setPlates] = useState(1)
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

  const getWhitelistRateByZone = async(e, rate)=>{
    setSpinner(true);
    const res = await rateServices.getWhitelistRateByZone({zone_id: e._id});
    if(rate)
      setSelectedRate(res.data.find(x=>x._id == rate));
    setRates(res.data);
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
    if(e.target.name == 'plate' || e.target.name == 'plate_two' || e.target.name == 'plate_three')
    e.target.value = e.target.value.toUpperCase();
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const handleCheck = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    inputField['org'] = selectedOrg._id;
    inputField['zone'] = selectedZone._id;
    inputField['rate'] = selectedRate._id;
    inputField['city'] = selectedZone.city_id;
    inputField['tenant_and_visitor'] = selectedZone.tenant_and_visitor;
    if(btn === props.literals.add){
      const res = await tenentPlateServices.addTenentPlate(inputField);
      if(inputField.park_now && res.data.status !== 'error'){
        purchaseParking(res);
        return;
      }
      setMsg(props.literals[res.data?.msg]);
      setSeverity(res.data?.status);
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
    await getWhitelistRateByZone(zone, e.rate);
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
      email: e.email,
      notes: e.notes
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

  const purchaseParking = async (tenantRes)=>{
    const res = await mainService.getRateSteps({ id: selectedRate._id, plate: inputField.plate, rate_type: selectedRate.rate_type, org: selectedZone.org._id, time_zone: selectedZone.city_id.time_zone, zone: selectedZone._id })
    if(res.data.length){
      if(res.data[0].total > 0){
        setMsg(props.literals.cannot_park_amount_is_greater_than_0);
        setSeverity('error');
        setAlert(true);
      }else{
        let body = {
          paymentMethod: '',
          amount: (res.data[0].total/100).toFixed(2),
          plate: inputField.plate.toUpperCase(),
          zone: selectedZone._id,
          city: selectedZone.city_id._id,
          from: res.data[0].current_time,
          to: res.data[0].time_desc,
          coord: '',
          rate: selectedRate._id,
          service_fee: res.data[0].service_fee,
          org: selectedZone.org._id,
          email: tenantRes.data.response?.email
        }
        const parkingRes = await parkingService.buyParking(body);
        if(!parkingRes.data.message){
          inputField['id'] = editId;
          await tenentPlateServices.editTenentPlate({
            id: tenantRes.data.response?._id,
            plate: tenantRes.data.response?.plate,
            parking: parkingRes.data._id
          });
          setMsg(props.literals[tenantRes.data?.msg]);
          setSeverity(tenantRes.data?.status);
          setAlert(true);
        }else{
          setMsg(parkingRes.data.message);
          setSeverity('error');
          setAlert(true);
        }
      }
    }else{
      setMsg('Parking not allowed during these hours');
      setSeverity('error');
      setAlert(true);
    }
    getTenantPlates();
    setInputField({});
    setOpenDrawer(false);
    setSpinner(false);
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
        rates={rates}
        selectedZone={selectedZone}
        selectedRate={selectedRate}
        user={user}
        plates={plates}
        
        setSelectedOrg={(e)=>setSelectedOrg(e)}
        setSelectedZone={(e)=>{setSelectedZone(e); getWhitelistRateByZone(e)}}
        setSelectedRate={(e)=>setSelectedRate(e)}
        handleChange={(e)=>handleChange(e)}
        handleSubmit={(e)=>handleSubmit(e)}
        onClose={()=>{setOpenDrawer(false)}}
        addPlate={()=>{setPlates(plates+1)}}
        delPlate={()=>{setPlates(plates-1)}}
        handleCheck={(e)=>handleCheck(e)}
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
