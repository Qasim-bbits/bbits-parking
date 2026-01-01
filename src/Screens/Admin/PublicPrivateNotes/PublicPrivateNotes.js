import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import noteServices from "../../../services/notes-service";
import AddPublicPrivateNote from "./AddPublicPrivateNote";
import PublicPrivateNotesView from "./PublicPrivateNotesView";
import organizationServices from "../../../services/organization-service";

export default function PublicPrivateNotes(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({type: 'public'});
  const [publicPrivateNotes, setPublicPrivateNotes] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getOrganizations();
    getPublicPrivateNotes();
  },[])

  const getPublicPrivateNotes = async()=>{
    setSpinner(true);
    const res = await noteServices.getNotes({org_id: props.org._id});
    setPublicPrivateNotes(res.data)
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
    if(btn === props.literals.add){
      await noteServices.addNote(inputField);
      setMsg(props.literals.note_added_successfully);
      setSeverity('success');
      setAlert(true);
    }else{
      inputField['id'] = editId;
      await noteServices.editNote(inputField);
      setBtn(props.literals.add)
      setMsg(props.literals.note_updated_successfully);
      setSeverity('success');
      setAlert(true);
    }
    getPublicPrivateNotes();
    setInputField({});
    setOpenDrawer(false);
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await noteServices.delNote({id: editId});
    if(res.data.deletedCount === 1)
    setPublicPrivateNotes(publicPrivateNotes.filter(function( obj ) {
        return obj._id !== editId;
    }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.note_deleted_successfully)
    setSeverity('success')
    setAlert(true)
  }

  const onEdit = async(e)=> {
    setInputField(e);
    let org = organizations.filter(x=>x._id == e.org._id);
    setSelectedOrg(org[0]);
    setOpenDrawer(true);
    setEditId(e._id);
    setBtn(props.literals.update);
  }

  const reset = ()=>{
    setInputField({});
    if(user.result?.role == 'root'){
      setSelectedOrg(null);
    }
    setBtn(props.literals.add);
  }

  return (
    <>
    <PublicPrivateNotesView
      publicPrivateNotes={publicPrivateNotes}
      literals={props.literals}

      onEdit={(e)=>onEdit(e)}
      delItem={(id) => {setEditId(id); setOpenDialog(true)}}
      setOpenDrawer={()=>{setOpenDrawer(!openDrawer); reset()}}
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
      <AddPublicPrivateNote
        inputField={inputField}
        btn={btn}
        literals = {props.literals}
        organizations={organizations}
        selectedOrg={selectedOrg}
        user={user}
        
        setSelectedOrg={(e)=>setSelectedOrg(e)}
        handleChange={(e)=>handleChange(e)}
        handleSubmit={(e)=>handleSubmit(e)}
        onClose={()=>{setOpenDrawer(false)}}
        onPublicPrivateNoteType={(e)=>setInputField({ ...inputField, ['type']: e.target.value })}
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
