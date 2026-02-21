import React, { useEffect, useState } from 'react';
import ZonesView from './ZonesView';
import Spinner from '../../../../shared/Spinner';
import mainService from '../../../../services/main-service';


export default function Zones(props) {
    const [zones, setZones] = useState([]);
    const [fiteredZones, setFiteredZones] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        getZones();
    }, [])

    const getZones = async()=>{
        setSpinner(true);
        const res = await mainService.getZonesById({id: props.inputField.city});
        setZones(res.data);
        setFiteredZones(res.data);
        if(res.data.length == 1){
            let obj = {
                ...props.inputField,
                zone: res.data[0]._id,
                zone_name: res.data[0].zone_name
            };
            props.setInputField(obj);
            props.handleNext();
        }
        setSpinner(false);
    }

    const handleSearch = (value) => {
        const filteredRows = zones.filter((row) => {
            return row.org_name.toLowerCase().includes(value.toLowerCase())
        });
        console.log(filteredRows)
        setFiteredZones(filteredRows);
    }

    return (
        <>
            <ZonesView
                org={props.org}
                literals={props.literals}
                zones={fiteredZones}
                inputField={props.inputField}

                handleSearch={(e) => handleSearch(e.target.value)}
                onChange={(e)=> props.setInputField({
                    org: props.inputField.org,
                    org_name: props.inputField.org_name,
                    ticket_format: props.inputField.ticket_format,
                    city: props.inputField.city,
                    city_name: props.inputField.city_name,
                    enable_custom_public_notes: props.inputField.enable_custom_public_notes,
                    enable_custom_private_notes: props.inputField.enable_custom_private_notes,
                    ...e
                })}
            />
            <Spinner
                spinner = {spinner}
            />
        </>
    );
}