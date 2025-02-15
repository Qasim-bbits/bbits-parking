import React, { useEffect, useState } from 'react';
import IssueTicketView from './IssueTicketView';
import Spinner from '../../../Common/Spinner';
import Alert from "../../../Common/Alerts";
import ticketServices from '../../../services/ticket-service';
import { AgentHeader } from '../../../components/AgentHeader';

export default function IssueTicket(props) {
    const [spinner, setSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [severity, setSeverity] = useState('');
    const [inputField, setInputField] = useState({});
    const [activeStep, setActiveStep] = React.useState(0);

    useEffect(() => {
    }, [])

    const onTicketIssued = async () => {
        let body = {...inputField};
        body.issued_by = JSON.parse(sessionStorage.getItem('userLogged')).result?._id;
        setSpinner(true);
        const res = await ticketServices.IssueTicket(body);
        if(res.data.status !== 'error'){
            setSeverity('success');
            setShowAlert(true);
            setAlertMessage('Ticket issued successfully');
            setActiveStep(2);
            setInputField({
                city: inputField.city,
                city_name: inputField.city_name,
                org: inputField.org,
                org_name: inputField.org_name
            })
        }
        setSpinner(false);

    }

    return (
        <AgentHeader org={props.org}>
            <IssueTicketView
                org={props.org}
                literals={props.literals}
                inputField={inputField}
                setInputField={setInputField}
                activeStep={activeStep}

                onChange={(e)=> setInputField({...inputField, [e.target.name] : e.target.value.toUpperCase()})}
                handleBack={()=>setActiveStep((prevActiveStep) => prevActiveStep - 1)}
                handleNext={()=>{setActiveStep((prevActiveStep) => prevActiveStep + 1)}}
                onTicketIssued={()=>onTicketIssued()}
            />
            <Spinner
                spinner = {spinner}
            />
            <Alert
                alertMessage = {alertMessage}
                showAlert = {showAlert}
                severity = {severity}
                
                closeAlert = {()=>setShowAlert(!showAlert)}
            />
        </AgentHeader>
    );
}