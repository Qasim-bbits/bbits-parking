import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import ticketServices from "../../../services/ticket-service";
import AddTicket from "./AddTicket";
import TicketsView from "./TicketsView";
import organizationServices from "../../../services/organization-service";

export default function Ticket(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({});
  const [tickets, setTickets] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [aging, setAging] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const inputsArr = [{rate: 0, time: 0}]
  const [inputs, setInputs] = useState(inputsArr);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getOrganizations();
    getTickets();
  },[])

  const getTickets = async()=>{
    setSpinner(true);
    const res = await ticketServices.getTickets({org_id: props.org._id});
    setTickets(res.data)
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
    setSpinner(true);
    inputField['ticket_aging'] = e;
    inputField['org'] = selectedOrg._id;
    if(btn === props.literals.add){
      await ticketServices.addTicket(inputField);
      setMsg(props.literals.ticket_added_successfully);
      setSeverity('success');
      setAlert(true);
    }else{
      inputField['id'] = editId;
      await ticketServices.editTicket(inputField);
      setBtn(props.literals.add)
      setMsg(props.literals.ticket_updated_successfully);
      setSeverity('success');
      setAlert(true);
    }
    getTickets();
    setInputField({});
    setOpenDrawer(false);
    setInputs(inputsArr);
    setSpinner(false);
  };

  const delItem=async()=>{
    setSpinner(true);
    const res = await ticketServices.delTicket({id: editId});
    if(res.data.deletedCount === 1)
    setTickets(tickets.filter(function( obj ) {
        return obj._id !== editId;
    }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.ticket_deleted_successfuly)
    setSeverity('success')
    setAlert(true)
  }

  const onEdit = async(e)=> {
    setInputField(e);
    let org = organizations.filter(x=>x._id == e.org._id);
    setSelectedOrg(org[0]);
    const res = await ticketServices.getAgingByTicket({ticket: e._id});
    let arr = [];
    res.data.map(x=>{
      let obj = {
        id: x._id,
        rate: x.rate,
        time: x.applied_from/24/60
      }
      arr.push(obj);
    })
    setInputs(arr)
    setOpenDrawer(true);
    setEditId(e._id);
    setBtn(props.literals.update);
  }

  const getAgingByTicket = async(e) => {
    setSpinner(true);
    const res = await ticketServices.getAgingByTicket({ticket: e});
    setAging(res.data);
    setSpinner(false);
  }

  const addInput = () => {
    setInputs(s => {return [ ...s,{rate: 0, time: 0}]});
  };

  const delInput = (index)=>{
    let clone = [...inputs];
    clone.splice(index , 1);
    setInputs(clone);
  }

  const handleInputChange = (e) => {
    const index = e.target.id;
    setInputs(s => {
      const newArr = s.slice();
      newArr[index][e.target.name] =  e.target.checked || e.target.value;
      return newArr;
    });
  };

  const reset = ()=>{
    setInputs(inputsArr);
    setInputField({});
    if(user.result?.role == 'root'){
      setSelectedOrg(null);
    }
    setBtn(props.literals.add);
  }

  return (
    <>
    <TicketsView
      tickets={tickets}
      literals={props.literals}
      aging={aging}

      onEdit={(e)=>onEdit(e)}
      delItem={(id) => {setEditId(id); setOpenDialog(true)}}
      setOpenDrawer={()=>{setOpenDrawer(!openDrawer); reset()}}
      getAgingByTicket={(e)=>getAgingByTicket(e)}
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
      <AddTicket
        inputField={inputField}
        btn={btn}
        literals = {props.literals}
        organizations={organizations}
        selectedOrg={selectedOrg}
        user={user}
        inputs={inputs}
        
        setSelectedOrg={(e)=>setSelectedOrg(e)}
        handleChange={(e)=>handleChange(e)}
        handleSubmit={(e)=>handleSubmit(e)}
        onClose={()=>{setOpenDrawer(false)}}
        addInput={()=>addInput()}
        delInput={(e)=>delInput(e)}
        handleInputChange={(e)=>handleInputChange(e)}
        onTicketType={(e)=>setInputField({ ...inputField, ['ticket_type']: e.target.value })}
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
