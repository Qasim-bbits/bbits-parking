import React, { useState } from 'react';
import SignUpView from './signUp.view';
import SnackAlert from '../../../Common/Alerts';
import authServices from '../../../services/auth-service';
import Spinner from '../../../Common/Spinner';

function SignupUtils(props) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [inputField, setInputField] = useState({language: 'en'});

  const handleChange = (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.value});
    if(e.target.name === 'language'){
      props.getLiterals(e.target.value);
    }
  }

  const handleCheck = (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.checked});
  }

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setShowSpinner(true);
    inputField['org'] = props.org._id
    inputField['role'] = 'user'
    const res = await authServices.signup(inputField);
    setSeverity(res.data.status);
    setAlertMessage(res.data.msg);
    setShowAlert(true);
    setShowSpinner(false);
  }

  return (
    <>
      {Object.keys(props.literals).length > 0 && <SignUpView
        inputField = {inputField}
        literals = {props.literals}
        org = {props.org}
        
        handleChange = {(e)=>handleChange(e)}
        handleCheck = {(e)=>handleCheck(e)}
        handleSubmit = {(e)=>handleSubmit(e)}
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

export default SignupUtils;