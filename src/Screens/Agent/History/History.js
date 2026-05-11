import React, { useEffect, useState } from 'react';
import HistoryView from './HistoryView';
import Spinner from '../../../shared/Spinner';
import Alert from "../../../Common/Alerts";
import { AgentHeader } from '../../../components/AgentHeader';
import ticketServices from '../../../services/ticket-service';
import { config } from '../../../Constants';
import moment from 'moment';
import helpers from '../../../Helpers/Helpers';


export default function History(props) {
    const [history, setHistory] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [severity, setSeverity] = useState('');
    const [inputField, setInputField] = useState({});
    const [printer, setPrinter] = useState(null);

    useEffect(() => {
        configurePrinter();
    }, [])

    const configurePrinter = (displayErrorMsg) => {
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

    const onSearch = async(e)=>{
        e.preventDefault();
        let body = {...inputField};
        body.agent = JSON.parse(sessionStorage.getItem('userLogged')).result?._id;
        setSpinner(true);
        const res = await ticketServices.getTicketsIssuedByAgent(body);
        setHistory(res.data);
        setSpinner(false);
    }

    const printTicket = async (ticket) => {
        if (printer) {
            setSpinner(true);
            const res = await ticketServices.getAgingByTicket({ticket: ticket._id});
            const aging = res.data;
            let agingSection = '';
            aging.map((x, index) => {
                if (x.applied_from == 0) {
                    agingSection += `^FT120,${500 + index * 50}^A0N,24,18^FH^FD${props.literals.within} ${(x.applied_to / 24 / 60)} ${props.literals.days}:^FS
                ^FT410,${500 + index * 50}^A0N,40,32^FH^FD$ ${(x.rate / 100).toFixed(2)}^FS`;
                } else if (x.applied_to == null) {
                    agingSection += `^FT120,${500 + index * 50}^A0N,24,18^FH^FD${props.literals.after} ${(x.applied_from / 24 / 60)} ${props.literals.days}:^FS
                ^FT410,${500 + index * 50}^A0N,40,32^FH^FD$ ${(x.rate / 100).toFixed(2)}^FS`;
                } else {
                    agingSection += `^FT120,${500 + index * 50}^A0N,24,18^FH^FD$${props.literals.within} ${(x.applied_from / 24 / 60)} ${props.literals.to} ${(x.applied_to / 24 / 60)} ${props.literals.days}:^FS
                ^FT410,${500 + index * 50}^A0N,40,32^FH^FD$ ${(x.rate / 100).toFixed(2)}^FS`;
                }
            });
            const ticketIssued = {
                ...ticket,
                org: ticket.org?._id,
                org_name: ticket.org?.org_name,
                city: ticket.city?._id,
                city_name: ticket.city?.city_name,
                zone: ticket.zone?._id,
                zone_name: ticket.zone?.zone_name,
                ticket: ticket.ticket?._id,
                ticket_name: ticket.ticket?.ticket_name,
                ticket_num_next: ticket.ticket?.ticket_num_next,
                agentId: ticket.issued_by,
                payTicketUrl: config.url.http + config.url.client_url + 'pay_ticket',
                agingSection: agingSection,
                amount: aging && aging.length ? `$ ${(aging[0].rate / 100).toFixed(2)}` : '$ 0.00',
                issued_at: moment(ticket.issued_at).format('ll hh:mm a'),
            }
            const ticketZPL = helpers.stringFormat(ticket.org?.ticket_format,ticketIssued);
            printer.send(ticketZPL, async function () {
                const body = {
                    ticketIssued: ticketIssued._id,
                    printed_ticket: ticketZPL,
                    org: ticketIssued.org,
                    printer_details: JSON.stringify(printer)
                }
                const res = await ticketServices.addPrintedTicket(body);
                setSpinner(false);
                setSeverity('success');
                setShowAlert(true);
                setAlertMessage('Ticket Print successfully');
            }, function (error) {
                setSpinner(false);
                setSeverity('error');
                setShowAlert(true);
                setAlertMessage('Failed to print');
            });
        }else{
            setSeverity('error');
            setShowAlert(true);
            setAlertMessage('No Zebra printer found')
        }
    }

    return (
        <AgentHeader org={props.org}>
            <HistoryView
                org={props.org}
                literals={props.literals}
                inputField={inputField}
                history={history}
                
                handleChange={(e)=>setInputField({ ...inputField, [e.target.name]: e.target.value })}
                printTicket={(e)=>printTicket(e)}
                onSearch={(e)=>onSearch(e)}
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