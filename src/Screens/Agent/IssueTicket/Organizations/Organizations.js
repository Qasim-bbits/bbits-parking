import React, { useEffect, useState } from 'react';
import OrganizationsView from './OrganizationsView';


export default function Organizations(props) {
    const [organizations, setOrganizations] = useState([]);
    const [fiteredOrganizations, setFiteredOrganizations] = useState([]);

    useEffect(() => {
        let userDetail = sessionStorage.getItem('userLogged');
        if(userDetail)
            setOrganizations(JSON.parse(userDetail).result?.organizations)
            setFiteredOrganizations(JSON.parse(userDetail).result?.organizations)
    }, [])

    const handleSearch = (value) => {
        const filteredRows = organizations.filter((row) => {
            return row.org_name.toLowerCase().includes(value.toLowerCase())
        });
        setFiteredOrganizations(filteredRows);
    }

    return (
        <>
            <OrganizationsView
                org={props.org}
                literals={props.literals}
                organizations={fiteredOrganizations}
                inputField={props.inputField}

                handleSearch={(e) => handleSearch(e.target.value)}
                onChange={(e)=> props.setInputField({...e})}
            />
        </>
    );
}