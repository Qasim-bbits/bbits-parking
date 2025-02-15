import React, { useEffect, useState } from 'react';
import TicketsView from './TicketsView';
import Spinner from '../../../../shared/Spinner';
import mainService from '../../../../services/main-service';
import ticketServices from '../../../../services/ticket-service';


export default function Tickets(props) {
    const [tickets, setTickets] = useState([]);
    const [fiteredTickets, setFiteredTickets] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        getTickets();
    }, [])

    const getTickets = async()=>{
        setSpinner(true);
        const res = await ticketServices.getTicketsByOrg({org_id: props.inputField.org});
        setTickets(res.data);
        setFiteredTickets(res.data);
        setSpinner(false);
    }

    const handleSearch = (value) => {
        const filteredRows = tickets.filter((row) => {
            return row.org_name.toLowerCase().includes(value.toLowerCase())
        });
        setFiteredTickets(filteredRows);
    }

    return (
        <>
            <TicketsView
                org={props.org}
                literals={props.literals}
                tickets={fiteredTickets}
                inputField={props.inputField}

                handleSearch={(e) => handleSearch(e.target.value)}
                onChange={(e)=> props.setInputField({...props.inputField, ...e})}
            />
            <Spinner
                spinner = {spinner}
            />
        </>
    );
}