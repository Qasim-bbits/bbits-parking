import React, { useState, useEffect } from "react";
import dashboardService from "../../../services/dashboard-service";
import Spinner from "../../../shared/Spinner";
import DashboardView from "./DashboardView";

export default function Dashboard(props) {
  const [spinner, setSpinner] = useState(false);
  const [dashboard, setDashboard] = useState(false);

  useEffect(() => {
    getDashboardData()
  }, []);

  const getDashboardData = async ()=>{
    setSpinner(true);
    const res = await dashboardService.getDashboard({org_id: props.org._id});
    setDashboard(res.data)
    setSpinner(false);
  }
  return (
    <div>
      <DashboardView 
        dashboard = {dashboard}
        literals = {props.literals}
      />
      <Spinner spinner={spinner} />
    </div>
  );
}
