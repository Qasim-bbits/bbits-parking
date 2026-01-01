import React, { useEffect, useState } from 'react';
import PrivateNotesView from './PrivateNotesView';
import Spinner from '../../../../shared/Spinner';
import noteServices from '../../../../services/notes-service';


export default function PrivateNotes(props) {
    const [privateNotes, setPrivateNotes] = useState([]);
    const [fiteredPrivateNotes, setFiteredPrivateNotes] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        getPrivateNotes();
    }, [])

    const getPrivateNotes = async()=>{
        setSpinner(true);
        const res = await noteServices.getNotesByType({org_id: props.inputField.org, type: 'private'});
        setPrivateNotes(res.data);
        setFiteredPrivateNotes(res.data);
        setSpinner(false);
    }

    const handleSearch = (value) => {
        const filteredRows = privateNotes.filter((row) => {
            return row.org_name.toLowerCase().includes(value.toLowerCase())
        });
        setFiteredPrivateNotes(filteredRows);
    }

    return (
        <>
            <PrivateNotesView
                org={props.org}
                literals={props.literals}
                privateNotes={fiteredPrivateNotes}
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