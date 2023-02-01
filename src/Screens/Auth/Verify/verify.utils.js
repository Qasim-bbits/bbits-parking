import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import VerifyView from './verify.view';
import authServices from '../../../services/auth-service';
import Spinner from '../../../Common/Spinner';
import NotVerify from './notVerify.view';

function VerifyUtils(props) {
  const {token} = useParams();
  const [showSpinner, setShowSpinner] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(()=>{
    verify();
  },[])
  
  const verify = async()=> {
    setShowSpinner(true);
    const res = await authServices.verify({token : token});
    setVerified(res.data.auth);
    setShowSpinner(false);
  }

  return (
    <>
      {verified && <VerifyView org={props.org}/>}
      {!verified && <NotVerify org={props.org}/>}
      <Spinner
        spinner = {showSpinner}
      />
    </>
  );
}

export default VerifyUtils;