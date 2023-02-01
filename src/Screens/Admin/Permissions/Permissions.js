import React, { useState, useEffect } from "react";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import permissionServices from "../../../services/permission-service";
import PermissionsView from "./PermissionsView";

export default function Permissions(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [permissions, setPermissions] = useState([])
  const [userPermission, setUserPermission] = useState([]);
  const isAdmin = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getPermissions();
  },[])

  const getPermissions = async()=>{
    setSpinner(true);
    let body = {
      role: isAdmin?.result?.role,
      user_id: isAdmin?.result?._id,
      org_id: isAdmin?.result?.org,
    };
    const res = await permissionServices.getPermissions(body);
    setPermissions(res.data)
    setSpinner(false);
  }
  
  const getUserPermissions = async(id)=>{
    setSpinner(true);
    const res = await permissionServices.getUserPermissions({user_id : id});
    setUserPermission(res.data);
    setSpinner(false);
  }

  const handleSwitch = async (value, id, user_id) =>{
    if(user_id == isAdmin?.result?._id){
      setAlert(true);
      setSeverity('info');
      setMsg(props.literals.cant_change_permission)
      return;
    }
    setSpinner(true);
    let selectedPermission = userPermission.find(x => x._id === id);
    let body = {
      [value] : !selectedPermission[value],
      id : id
    }
    await permissionServices.editPermission(body);
    getUserPermissions(user_id);
  }

  return (
    <>
      <PermissionsView
        permissions={permissions}
        userPermission={userPermission}
        literals = {props.literals}

        handleSwitch={(e, id, user_id)=>handleSwitch(e, id, user_id)}
        getUserPermissions={(e)=>getUserPermissions(e)}
        setOpenDrawer={()=>setOpenDrawer(!openDrawer)}
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
        // delItem = {()=>delItem()}
      />
    </>
  );
}
