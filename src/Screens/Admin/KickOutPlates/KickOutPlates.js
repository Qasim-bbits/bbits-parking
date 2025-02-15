import React, { useState, useEffect } from "react";
import Spinner from "../../../shared/Spinner";
import KickOutPlateServices from "../../../services/kick-out-service";
import KickOutPlatesView from "./KickOutPlatesView";

export default function KickOutPlates(props) {
  const [spinner, setSpinner] = useState(false);
  const [kickOutPlates, setKickOutPlates] = useState([])

  useEffect(()=>{
    getKickOutPlates();
  },[])

  const getKickOutPlates = async()=>{
    setSpinner(true);
    const res = await KickOutPlateServices.getKickOutPlates({org_id: props.org._id});
    setKickOutPlates(res.data)
    setSpinner(false);
  }

  return (
    <>
      <KickOutPlatesView
        kickOutPlates={kickOutPlates}
        literals={props.literals}
      />
      <Spinner
        spinner = {spinner}
      />
    </>
  );
}
