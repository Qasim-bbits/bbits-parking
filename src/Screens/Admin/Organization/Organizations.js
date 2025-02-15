import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import organizationServices from "../../../services/organization-service";
import AddOrganization from "./AddOrganization";
import OrganizationsView from "./OrganizationsView";
import helpers from "../../../Helpers/Helpers";
import moduleServices from "../../../services/module-service";

export default function Organizations(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({role: 'admin', color: '#000000'});
  const [organizations, setOrganizations] = useState([]);
  const [modules, setModules] = useState([]);
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const [logo, setLogo] = useState({});

  useEffect(()=>{
    getOrganizations();
    getModules();
  },[])

  const getOrganizations = async()=>{
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    setOrganizations(res.data)
    setSpinner(false);
  }

  const getModules = async()=>{
    setSpinner(true);
    let res = await moduleServices.getModules();
    res.data.map(x=>{
      x.can_view = (x.key === 'module' || 
                    x.key === 'organizations') ? false : true;
      x.can_add = (x.key === 'module' || 
                    x.key === 'organizations') ? false : true;
      x.can_edit = (x.key === 'module' || 
                    x.key === 'organizations') ? false : true;
      x.can_delete = (x.key === 'module' || 
                    x.key === 'organizations') ? false : true;
    })
    setModules(res.data);
    setSpinner(false);
  }

  const handleChange = (e) => {
    if(e.target.name === 'org_name'){
      let data = {...inputField};
      data['org_name'] = e.target.value;
      data['sub_domain'] = e.target.value.replace(/\s/g, '');
      setInputField(data);
    }else{
      setInputField({ ...inputField, [e.target.name]: e.target.value });
    }
  };

  const handleSwitch = (value, module) =>{
    let items = modules;
    let index = items.findIndex(el => el._id === module);
    items[index][value] = !items[index][value];
    setModules([...items]);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    if(logo === {} && btn === props.literals.add){
      setMsg(props.literals.please_upload_logo);
      setSeverity('error');
      setAlert(true);
      return;
    }
    let formData = new FormData();
        formData = helpers.createFormData(formData,inputField);
        formData.append('logo', logo);
        formData.append('permission', JSON.stringify(modules));
    let res;  
    if(btn === props.literals.add){
      res = await organizationServices.addOrganization(formData);
      setMsg(res.data.msg);
      setSeverity(res.data.status);
      setAlert(true);
    }else{
      formData.append('id', editId);
      res = await organizationServices.editOrganization(formData);
      setMsg(res.data.msg);
      setSeverity(res.data.status);
      setAlert(true);
    }
    if(res.data.status === 'success'){
      setBtn(props.literals.add)
      getOrganizations();
      setInputField({});
      setOpenDrawer(false);
    }
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await organizationServices.delOrganization({id: editId});
    if(res.data.deletedCount === 1){
      setOrganizations(organizations.filter(function( obj ) {
        return obj._id !== editId;
      }))
      setMsg(props.literals.org_deleted_successfuly)
      setSeverity('success')
    }else{
      setMsg('Unable to delete')
      setSeverity('error')
    }
    setSpinner(false);
    setOpenDialog(false);
    setAlert(true)
  }

  const onEdit = async(e)=> {
    if(e.payment_gateway == 'stripe'){
      if(helpers.crypto_decrypt(e.stripe_publishable_key) !== ''){
        e.stripe_publishable_key = helpers.crypto_decrypt(e.stripe_publishable_key);
        e.stripe_secret_key = helpers.crypto_decrypt(e.stripe_secret_key);
      }
    }else{
      if(helpers.crypto_decrypt(e.moneris_store_id) !== ''){
        e.moneris_store_id = helpers.crypto_decrypt(e.moneris_store_id);
        e.moneris_api_token = helpers.crypto_decrypt(e.moneris_api_token);
        e.moneris_checkout_id = helpers.crypto_decrypt(e.moneris_checkout_id);
      }
    }
    setInputField(e);
    setOpenDrawer(true);
    setEditId(e._id);
    setBtn(props.literals.update);
  }

  const reset = ()=>{
    setBtn(props.literals.add);
    setInputField({});
  }

  const handleCheck = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.checked });
  };

  return (
    <>
    <OrganizationsView
      organizations={organizations}
      literals={props.literals}

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
      onClose={()=>{setOpenDrawer(false); reset();}}
    >
      <AddOrganization
        inputField={inputField}
        btn={btn}
        modules={modules}
        literals={props.literals}

        setLogo={(e)=>setLogo(e)}
        handleChange={(e)=>handleChange(e)}
        handleSwitch={(e,x)=>handleSwitch(e,x)}
        handleSubmit={(e)=>handleSubmit(e)}
        onClose={()=>setOpenDrawer(false)}
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
