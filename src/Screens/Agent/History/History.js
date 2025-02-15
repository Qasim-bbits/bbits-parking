import React, { useState } from 'react';
import HistoryView from './HistoryView';
import Spinner from '../../../shared/Spinner';
import { AgentHeader } from '../../../components/AgentHeader';
import ticketServices from '../../../services/ticket-service';


export default function History(props) {
    const [history, setHistory] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const [inputField, setInputField] = useState({});

    const onSearch = async(e)=>{
        e.preventDefault();
        let body = {...inputField};
        body.agent = JSON.parse(sessionStorage.getItem('userLogged')).result?._id;
        setSpinner(true);
        const res = await ticketServices.getTicketsIssuedByAgent(body);
        setHistory(res.data);
        setSpinner(false);
    }

    return (
        <AgentHeader org={props.org}>
            <HistoryView
                org={props.org}
                literals={props.literals}
                inputField={inputField}
                history={history}
                
                handleChange={(e)=>setInputField({ ...inputField, [e.target.name]: e.target.value })}
                onSearch={(e)=>onSearch(e)}
            />
            <Spinner
                spinner = {spinner}
            />
        </AgentHeader>
    );
}