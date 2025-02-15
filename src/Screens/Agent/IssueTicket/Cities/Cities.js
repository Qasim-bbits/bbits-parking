import React, { useEffect, useState } from 'react';
import CitiesView from './CitiesView';
import cityServices from '../../../../services/city-service';
import Spinner from '../../../../shared/Spinner';


export default function Cities(props) {
    const [cities, setCities] = useState([]);
    const [fiteredCities, setFiteredCities] = useState([]);
    const [spinner, setSpinner] = useState(false);

    useEffect(() => {
        getCities();
    }, [])

    const getCities = async()=>{
        setSpinner(true);
        const res = await cityServices.getCities({org_id: props.inputField.org});
        setCities(res.data.filter(x => x.org._id == props.inputField.org));
        setFiteredCities(res.data.filter(x => x.org._id == props.inputField.org));
        setSpinner(false);
    }

    const handleSearch = (value) => {
        const filteredRows = cities.filter((row) => {
            return row.org_name.toLowerCase().includes(value.toLowerCase())
        });
        console.log(filteredRows)
        setFiteredCities(filteredRows);
    }

    return (
        <>
            <CitiesView
                org={props.org}
                literals={props.literals}
                cities={fiteredCities}
                inputField={props.inputField}

                handleSearch={(e) => handleSearch(e.target.value)}
                onChange={(e)=> props.setInputField({
                    org: props.inputField.org,
                    org_name: props.inputField.org_name,
                    ...e
                })}
            />
            <Spinner
                spinner = {spinner}
            />
        </>
    );
}