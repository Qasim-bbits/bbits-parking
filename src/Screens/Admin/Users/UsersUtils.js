import React, {useState, useEffect} from "react";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import userServices from "../../../services/user-service";
import UsersView from "./UsersView";
import AddUser from "./AddUser";
import organizationServices from "../../../services/organization-service";
import moduleServices from "../../../services/module-service";
import cityServices from "../../../services/city-service";
import permissionServices from "../../../services/permission-service";

export default function UsersUtils(props) {
  const [spinner, setSpinner] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const [msg, setMsg] = useState('');
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [editId, setEditId] = React.useState();
  const [inputField, setInputField] = useState({});
  const [organizations, setOrganizations] = useState([])
  const [selectedCities, setSelectedCities] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [modules, setModules] = useState([]);
  const [cities, setCities] = useState([]);
  const [btn, setBtn] = useState(props.literals.add);
  const [users, setUsers] = useState([]);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
    getUsers();
    getOrganizations();
    getModules();
    getCities();
  },[])

  const getUsers = async()=>{
    setSpinner(true);
    const res = await userServices.getUsers({org_id: props.org._id});
    setUsers(res.data)
    setSpinner(false);
  }

  const getCities = async()=>{
    setSpinner(true);
    const res = await cityServices.getCities({org_id: props.org._id});
    setCities(res.data)
    setSpinner(false);
  }

  const getModules = async()=>{
    setSpinner(true);
    let res = await moduleServices.getModules();
    res.data.map(x=>{
      x.can_view = (x.module_name === 'Manage Modules' || x.module_name === 'Manage Organizations') ? false : true;
      x.can_add = (x.module_name === 'Manage Modules' || x.module_name === 'Manage Organizations') ? false : true;
      x.can_edit = (x.module_name === 'Manage Modules' || x.module_name === 'Manage Organizations') ? false : true;
      x.can_delete = (x.module_name === 'Manage Modules' || x.module_name === 'Manage Organizations') ? false : true;
    })
    setModules(res.data);
    setSpinner(false);
  }

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

  const handleChange = (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.value});
  }

  const handleSwitch = (value, module) =>{
    let items = modules;
    let index = items.findIndex(el => el._id === module);
    items[index][value] = !items[index][value];
    setModules([...items]);
  }

  const handleSubmit = async(e)=> {
    e.preventDefault();
    if(inputField.role == 'agent' && selectedCities.length == 0){
      setMsg(props.literals.please_select_cities)
      setSeverity('error')
      setAlert(true)
      return;
    }
    setSpinner(true);
    inputField['permission'] = modules;
    inputField['cities'] = selectedCities.map(a => a._id);
    let res;
    if(btn === props.literals.add){
      inputField['org_id'] = selectedOrg._id;
      res = await userServices.addUser(inputField);
    }else{
      inputField['org'] = selectedOrg._id;
      inputField['id'] = editId;
      res = await userServices.editUser(inputField);
    }
    if(res.data.status !== 'error'){
      setOpenDrawer(false);
      setOpenDialog(false);
      setInputField({});
      getUsers();
    }
    setSpinner(false);
    setMsg(res.data.msg)
    setSeverity(res.data.status)
    setAlert(true)
  }

  const onEdit = async(e)=> {
    setSpinner(true);
    console.log(e);
    if(e.role == 'agent'){
      const res = await permissionServices.getAgentPermissions({user_id: e._id});
      setSelectedCities(res.data[0].cities)
    }
    setSelectedOrg(e.org)
    setInputField(e);
    setBtn(props.literals.update)
    setOpenDrawer(true);
    setEditId(e._id);
    setSpinner(false);
  }

  const delItem=async()=>{
    setSpinner(true);
    const res = await userServices.delUser({id: editId});
    if(res.data.deletedCount === 1)
    setUsers(users.filter(function( obj ) {
        return obj._id !== editId;
    }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg('User deleted successfuly')
    setSeverity('success')
    setAlert(true)
  }

  return (
    <>
      <UsersView
        users = {users}
        literals = {props.literals}

        delItem = {(id) => {setEditId(id); setOpenDialog(true)}}
        onEdit = {(e)=>onEdit(e)}
        setOpenDrawer = {()=>setOpenDrawer(!openDrawer)}
      />
      <AddUser
        openDrawer = {openDrawer}
        inputField = {inputField}
        btn = {btn}
        organizations={organizations}
        selectedOrg={selectedOrg}
        selectedCities={selectedCities}
        modules={modules}
        cities={cities}
        literals = {props.literals}
        user={user}

        setSelectedOrg = {(e)=>setSelectedOrg(e)}
        setSelectedCities = {(e)=>setSelectedCities(e)}
        setOpenDrawer = {()=>setOpenDrawer(!openDrawer)}
        handleSubmit = {(e)=>handleSubmit(e)}
        handleChange = {(e)=>handleChange(e)}
        handleSwitch={(e,x)=>handleSwitch(e,x)}
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
