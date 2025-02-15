import React, { useEffect, useState } from 'react';
import SummaryView from './SummaryView';
import Spinner from '../../../../shared/Spinner';
import ticketServices from '../../../../services/ticket-service';

export default function Summary(props) {
    const [aging, setAging] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        getAgingByTicket();
    }, [])

    const getAgingByTicket = async()=>{
        setSpinner(true);
        const res = await ticketServices.getAgingByTicket({ticket: props.inputField.ticket});
        setAging(res.data);
        setSpinner(false);
    }

    return (
        <>
            <SummaryView
                literals={props.literals}
                aging={aging}
                inputField={props.inputField}
            />
            <Spinner
                spinner = {spinner}
            />
        </>
    );
}