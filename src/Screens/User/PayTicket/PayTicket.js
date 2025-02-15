import React, {useState, useEffect} from 'react';
import SnackAlert from '../../../shared/SnackAlert';
import Spinner from '../../../Common/Spinner';
import { Layout } from '../../../components/SidebarHeaderWrapper';
import organizationServices from '../../../services/organization-service';
import cityServices from '../../../services/city-service';
import PayTicketView from './PayTicketView';
import ticketServices from '../../../services/ticket-service';
import Moneris from './Moneris';

export default function PayTicket(props) {
  const user = JSON.parse(sessionStorage.getItem('userLogged'));
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState('');
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [inputField, setInputField] = useState({});
  const [cities, setCities] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedCity, setSelectedCity] = useState(null)
  const [ticketOrg, setTicketOrg] = useState({})
  const [activeStep, setActiveStep] = React.useState(0);
  const [ticket, setTicket] = React.useState([]);
  const [selectedtickets, setSelectedtickets] = React.useState([]);
  const [showMoneris, setShowMoneris] = useState(false)

  useEffect(()=>{
    getOrganizations();
    getCities();
  },[])

  const getOrganizations = async()=>{
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    if(user == null || user.result?.role !== 'root'){
      let org = res.data.filter(x=>x._id == props.org._id);
      setSelectedOrg(org[0])
    }
    setOrganizations(res.data)
    setSpinner(false);
  }

  const getCities = async()=>{
    setSpinner(true);
    const res = await cityServices.getCities({org_id: props.org._id});
    setCities(res.data)
    setSpinner(false);
  }

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value.toUpperCase().replace(/\s/g, '') });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpinner(true);
    // inputField['org'] = selectedOrg._id;
    // inputField['city'] = selectedCity._id;
    const res = await ticketServices.searchTicket(inputField);
    if(res.data.status !== undefined){
      setAlert(true);
      setMsg(props.literals[res.data.msg]);
      setSeverity(res.data.status);
    }else{
      setSelectedtickets(res.data);
      setTicketOrg(res.data[0].ticketIssued.org)
      setTicket(res.data);
      setActiveStep(1);
    }
    setSpinner(false);
  }

  const emailTicketReciept = async (e) =>{
    console.log(e)
    const res = await ticketServices.searchTicket(inputField);
  }

  const onChecked = async (e) =>{
    let allTickets = [...selectedtickets];
    let findIndex = allTickets.findIndex(x=> x.ticketIssued._id == e.ticketIssued._id);
    if(findIndex > -1){
      allTickets.splice(findIndex, 1);
    }else{
      allTickets.push(e);
    }
    setSelectedtickets(allTickets)
  }
  
  return (
    <>
      <Layout org={props.org} literals = {props.literals}>
        <PayTicketView 
          user = {user}
          org={ticketOrg}
          literals={props.literals}
          activeStep={activeStep}
          cities = {cities}
          organizations = {organizations}
          selectedCity = {selectedCity}
          selectedOrg = {selectedOrg}
          inputField = {inputField}
          ticket = {ticket}
          selectedTickets = {selectedtickets}

          handleChange={(e)=>handleChange(e)}
          handleSubmit={(e)=>handleSubmit(e)}
          setSelectedOrg={(e)=>setSelectedOrg(e)}
          setSelectedCity={(e)=>setSelectedCity(e)}
          emailTicketReciept={(e)=>emailTicketReciept(e)}
          handleBack={()=>setActiveStep((prevActiveStep) => prevActiveStep - 1)}
          handleNext={()=>setActiveStep((prevActiveStep) => prevActiveStep + 1)}
          showMoneris = {()=>setShowMoneris(true)}
          onChecked = {(e)=>onChecked(e)}
        />
        {showMoneris &&
          <Moneris
            amount={ticket?.reduce((n, { ticketAmount }) => n + ticketAmount.rate, 0)}
            plate={ticket[0]?.ticketIssued?.plate}
            ticketIds={ticket.map(x => ({id: x.ticketIssued?._id, amount: x.ticketAmount.rate }))}
            org={ticketOrg}
            literals={props.literals}
            zone={JSON.stringify(ticket?.map(x => x?.ticketIssued?.zone?.zone_name))}

            handleBack = {()=>setShowMoneris(false)}
            handleNext = {()=>{setActiveStep(2);setShowMoneris(false);}}
          />
        }
        <SnackAlert
          msg = {msg}
          alert = {alert}
          severity = {severity}
          
          closeAlert = {()=>setAlert(!alert)}
        />
        <Spinner
          spinner = {spinner}
        />
      </Layout>
    </>
  );
}