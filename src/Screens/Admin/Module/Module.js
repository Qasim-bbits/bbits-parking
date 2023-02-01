import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import moduleServices from "../../../services/module-service";
import AddModule from "./AddModule";
import ModulesView from "./ModulesView";

export default function Module(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({});
  const [modules, setModules] = useState([])
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);

  useEffect(()=>{
    getModules();
  },[])

  const getModules = async()=>{
    setSpinner(true);
    const res = await moduleServices.getModules();
    setModules(res.data)
    setSpinner(false);
  }

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(btn === props.literals.add){
      await moduleServices.addModule(inputField);
      setMsg(props.literals.module_added_successfully);
      setSeverity('success');
      setAlert(true);
    }else{
      inputField['id'] = editId;
      await moduleServices.editModule(inputField);
      setBtn(props.literals.add)
      setMsg(props.literals.module_updated_successfully);
      setSeverity('success');
      setAlert(true);
    }
    getModules();
    setInputField({});
    setOpenDrawer(false);
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await moduleServices.delModule({id: editId});
    if(res.data.deletedCount === 1)
    setModules(modules.filter(function( obj ) {
        return obj._id !== editId;
    }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.module_deleted_successfuly)
    setSeverity('success')
    setAlert(true)
  }

  const onEdit = async(e)=> {
    inputField["module_name"] = e.module_name;
    inputField["key"] = e.key;
    setOpenDrawer(true);
    setEditId(e._id);
    setBtn(props.literals.update);
  }

  return (
    <>
    <ModulesView
      modules={modules}
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
              ? "35% !important"
              : "100% !important",
        },
      }}
      anchor={'right'}
      open={openDrawer}
      onClose={()=>setOpenDrawer(false)}
    >
      <AddModule
        inputField={inputField}
        btn={btn}
        literals = {props.literals}
        
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
