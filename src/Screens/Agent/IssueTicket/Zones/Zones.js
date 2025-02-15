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
                    city: props.inputField.city,
                    city_name: props.inputField.city_name,
                    ...e
                })}
            />
            <Spinner
                spinner = {spinner}
            />
        </>
    );
}