import React, { useEffect, useState } from 'react';
import PublicNotesView from './PublicNotesView';
import Spinner from '../../../../shared/Spinner';
import noteServices from '../../../../services/notes-service';


export default function PublicNotes(props) {
    const [publicNotes, setPublicNotes] = useState([]);
    const [fiteredPublicNotes, setFiteredPublicNotes] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        getPublicNotes();
    }, [])

    const getPublicNotes = async()=>{
        setSpinner(true);
        const res = await noteServices.getNotesByType({org_id: props.inputField.org, type: 'public'});
        setPublicNotes(res.data);
        setFiteredPublicNotes(res.data);
        setSpinner(false);
    }

    const handleSearch = (value) => {
        const filteredRows = publicNotes.filter((row) => {
            return row.note.toLowerCase().includes(value.toLowerCase())
        });
        setFiteredPublicNotes(filteredRows);
    }

    return (
        <>
            <PublicNotesView
                org={props.org}
                literals={props.literals}
                publicNotes={fiteredPublicNotes}
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