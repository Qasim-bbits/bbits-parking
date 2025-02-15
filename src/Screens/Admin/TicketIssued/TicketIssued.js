import React, { useState, useEffect } from "react";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import ticketServices from "../../../services/ticket-service";
import TicketsIssuedView from "./TicketsIssuedView";

export default function TicketIssued(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [ticketsIssued, setTicketsIssued] = useState([])
  const [aging, setAging] = useState([])
  const [editId, setEditId] = useState('');

  useEffect(()=>{
    getTicketsIssued();
  },[])

  const getTicketsIssued = async()=>{
    setSpinner(true);
    const res = await ticketServices.getTicketsIssued({org_id: props.org._id});
    setTicketsIssued(res.data)
    setSpinner(false);
  }

  const delItem=async()=>{
    setSpinner(true);
    const res = await ticketServices.delIssuedTicket(editId);
    if(res.data.deletedCount === 1)
    setTicketsIssued(ticketsIssued.filter(function( obj ) {
        return obj._id !== editId;
    }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.ticket_deleted_successfuly)
    setSeverity('success')
    setAlert(true)
  }

  // const onEdit = async(e)=> {
  //   setInputField(e);
  //   let org = organizations.filter(x=>x._id == e.org._id);
  //   setSelectedOrg(org[0]);
  //   const res = await ticketServices.getAgingByTicket({ticket: e._id});
  //   let arr = [];
  //   res.data.map(x=>{
  //     let obj = {
  //       id: x._id,
  //       rate: x.rate,
  //       time: x.applied_from/24/60
  //     }
  //     arr.push(obj);
  //   })
  //   setInputs(arr)
  //   setOpenDrawer(true);
  //   setEditId(e._id);
  //   setBtn(props.literals.update);
  // }

  const getAgingByTicket = async(e) => {
    setSpinner(true);
    const res = await ticketServices.getAgingByTicket({ticket: e});
    setAging(res.data);
    setSpinner(false);
  }

  return (
    <>
      <TicketsIssuedView
        ticketsIssued = {ticketsIssued}
        literals={props.literals}
        aging={aging}

        // onEdit={(e)=>onEdit(e)}
        delItem={(id) => {setEditId(id); setOpenDialog(true)}}
        setOpenDrawer={()=>{setOpenDrawer(!openDrawer)}}
        getAgingByTicket={(e)=>getAgingByTicket(e)}
      />
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
