import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { router } from '../../../../Routes/routhPaths';
import LoginView from './login.view';
import SnackAlert from '../../../../Common/Alerts';
import authServices from '../../../../services/auth-service';
import Spinner from '../../../../Common/Spinner';
import helpers from '../../../../Helpers/Helpers';

function LoginUtils(props) {
  let navigate = useNavigate();
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [inputField, setInputField] = useState({language: '', rememberMe: false, email: '', password: ''});
  const [resetPassword, setResetPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [notVerified, setNotVerified] = useState(false);

  useEffect(()=>{
    let creds = JSON.parse(localStorage.getItem("loginCreds"));
    if(creds !== null){
      setInputField(creds);
      props.getLiterals(creds.language);
    }else{
      props.getLiterals(helpers.getLang());
      setInputField({...inputField, ['language'] : helpers.getLang()})
    }
  },[])

  const handleChange = (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.value});
    if(e.target.name === 'language'){
      props.getLiterals(e.target.value);
    }
  }

  const handleChecked = (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.checked});
  }

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setShowSpinner(true);
    setNotVerified(false);
    const res = await authServices.agentLogin(inputField);
    if(res.data.auth){
      if(res.data.result.forget_password){
        setUserId(res.data.result._id)
        setResetPassword(true);
        setShowSpinner(false);
        return;
      }
      if(inputField['rememberMe']){
        localStorage.setItem('loginCreds', JSON.stringify(inputField))
      }else{
        localStorage.removeItem('loginCreds')
      }
      sessionStorage.setItem('userLogged', JSON.stringify(res.data));
      navigate(router.agentIssueTicket)
    }else{
      if(res.data.not_verified) setNotVerified(true);
      setAlertMessage(res.data.msg);
      setSeverity('error');
      setShowAlert(true);
    }
    setShowSpinner(false);
  }

  const handleChangePassword = async(e)=> {
    e.preventDefault();
    setShowSpinner(true);
    inputField.id = userId;
    const res = await authServices.changePassword(inputField);
    if(res.data.auth){
      sessionStorage.setItem('userLogged', JSON.stringify(res.data));
      if(res.data.result.role === "root"){
        navigate(router.dashboard)
      }else if(res.data.result.role === "admin"){
        let permission = res.data.result?.permissions.filter(x=>x.can_view == true);
        navigate(router.suite +"/"+ permission[0].module.key);
      }else{
        navigate(router.main);
      }
    }else{
      setAlertMessage(res.data.msg);
      setSeverity('error');
      setShowAlert(true);
    }
    setShowSpinner(false);
  }

  const resend = async () => {
    console.log(inputField);
    const res = await authServices.resend({email: inputField.email, org: props.org._id});
    setSeverity(res.data.success ? 'success' : 'error');
    setAlertMessage(res.data.msg);
    setShowAlert(true);
  }

  return (
    <>
      {Object.keys(props.literals).length > 0 && <LoginView
        inputField = {inputField}
        resetPassword = {resetPassword}
        org = {props.org}
        literals = {props.literals}
        notVerified = {notVerified}
        
        handleChange = {(e)=>handleChange(e)}
        handleChecked = {(e)=>handleChecked(e)}
        handleSubmit = {(e)=>handleSubmit(e)}
        handleChangePassword = {(e)=>handleChangePassword(e)}
        setResetPassword = {()=>setResetPassword(true)}
        resend = {()=>resend()}
      />}
      <SnackAlert
        alertMessage = {alertMessage}
        showAlert = {showAlert}
        severity = {severity}
        
        closeAlert = {()=>setShowAlert(!showAlert)}
      />
      <Spinner
        spinner = {showSpinner}
      />
    </>
  );
}

export default LoginUtils;