import React, { useEffect, useState } from 'react';
import IssueTicketView from './IssueTicketView';
import Spinner from '../../../Common/Spinner';
import Alert from "../../../Common/Alerts";
import ticketServices from '../../../services/ticket-service';
import { AgentHeader } from '../../../components/AgentHeader';
import moment from 'moment';
import helpers from '../../../Helpers/Helpers';

export default function IssueTicket(props) {
    const [spinner, setSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [severity, setSeverity] = useState('');
    const [inputField, setInputField] = useState({});
    const [activeStep, setActiveStep] = React.useState(0);
    const [printer, setPrinter] = useState(null);
    const [isTicketIssued, setIsTicketIssued] = useState(false);
    const [ticketIssued, setTicketIssued] = useState({});

    useEffect(() => {
        configurePrinter();
    }, [])

    const configurePrinter = (displayErrorMsg) => {
        const ticketZPL = helpers.stringFormat(inputField.ticket_format,ticketIssued);
        console.log(ticketZPL)
        if (window.BrowserPrint) {
            setSpinner(true);
            window.BrowserPrint.getDefaultDevice("printer", function (device) {
                setPrinter(device);
                setSpinner(false);
            }, function (error) {
                setSpinner(false);
                if(displayErrorMsg) {
                    setSeverity('error');
                    setShowAlert(true);
                    setAlertMessage('No Zebra printer found')
                }
            });
        }
    }

    const onTicketIssued = async () => {
        let body = {...inputField};
        body.issued_by = JSON.parse(sessionStorage.getItem('userLogged')).result?._id;
        setSpinner(true);
        const res = await ticketServices.IssueTicket(body);
        if(res.data.status !== 'error'){
            setTicketIssued({...ticketIssued, issued_at: moment().format('ll hh:mm a') , _id: res.data._id});
            setSeverity('success');
            setShowAlert(true);
            setAlertMessage('Ticket issued successfully');
            // if(!printer){
            //     setActiveStep(3);
            //     setInputField({
            //         city: inputField.city,
            //         city_name: inputField.city_name,
            //         zone: inputField.zone,
            //         zone_name: inputField.zone_name,
            //         org: inputField.org,
            //         org_name: inputField.org_name,
            //         ticket_format: inputField.ticket_format,
            //     });
            // }else
                setIsTicketIssued(true);
        }
        setSpinner(false);

    }

    const printTicket = async () => {
        const ticketZPL = helpers.stringFormat(inputField.ticket_format,ticketIssued);
        console.log(ticketZPL)
        if (printer) {
            setSpinner(true);
            const zpl = "^XA^FO50,50^ADN,36,20^FDHello Zebra!^FS^XZ";
            printer.send(ticketZPL, async function () {
            const body = {
                ticketIssued: ticketIssued._id,
                printed_ticket: ticketZPL,
                org: ticketIssued.org,
                printer_details: JSON.stringify(printer)
            }
            const res = await ticketServices.addPrintedTicket(body);
            setSpinner(false);
            setIsTicketIssued(false);
            setSeverity('success');
            setShowAlert(true);
            setAlertMessage('Ticket Print successfully');
            setActiveStep(3);
            setInputField({
                city: inputField.city,
                city_name: inputField.city_name,
                zone: inputField.zone,
                zone_name: inputField.zone_name,
                org: inputField.org,
                org_name: inputField.org_name,
                ticket_format: inputField.ticket_format,
                enable_custom_public_notes: inputField.enable_custom_public_notes,
                enable_custom_private_notes: inputField.enable_custom_private_notes
            });
          }, function (error) {
            setSpinner(false);
            setSeverity('error');
            setShowAlert(true);
            setAlertMessage('Failed to print');
          });
        }
    };

    const handleBack = () => {
        if(isTicketIssued){
            setActiveStep(3);
            setIsTicketIssued(false);
            setInputField({
                city: inputField.city,
                city_name: inputField.city_name,
                zone: inputField.zone,
                zone_name: inputField.zone_name,
                org: inputField.org,
                org_name: inputField.org_name,
                ticket_format: inputField.ticket_format,
                enable_custom_public_notes: inputField.enable_custom_public_notes,
                enable_custom_private_notes: inputField.enable_custom_private_notes
            });
        }else
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }

    return (
        <AgentHeader org={props.org}>
            <IssueTicketView
                org={props.org}
                literals={props.literals}
                inputField={inputField}
                setInputField={setInputField}
                activeStep={activeStep}
                isTicketIssued={isTicketIssued}
                printer={printer}

                onChange={(e)=> setInputField({...inputField, [e.target.name] : e.target.value.toUpperCase()})}
                handleBack={()=>handleBack()}
                handleNext={()=>{setActiveStep((prevActiveStep) => prevActiveStep + 1)}}
                onTicketIssued={()=>onTicketIssued()}
                printTicket={()=>printTicket()}
                setTicketIssued={(e)=>setTicketIssued(e)}
                configurePrinter={()=>configurePrinter(true)}
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