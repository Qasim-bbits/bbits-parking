import React, { useEffect, useState } from 'react';
import OrganizationsView from './OrganizationsView';


export default function Organizations(props) {
    const [organizations, setOrganizations] = useState([]);
    const [fiteredOrganizations, setFiteredOrganizations] = useState([]);

    useEffect(() => {
        let userDetail = sessionStorage.getItem('userLogged');
        if(userDetail){
            let orgs = JSON.parse(userDetail).result?.organizations;
            setOrganizations(orgs)
            setFiteredOrganizations(orgs)
            if(orgs.length == 1){
            let obj = {
                    org: orgs[0]._id,
                    org_name: orgs[0].org_name,
                    ticket_format: orgs[0].ticket_format,
                    enable_custom_public_notes: orgs[0].enable_custom_public_notes,
                    enable_custom_private_notes: orgs[0].enable_custom_private_notes
                };
                props.setInputField({...obj});
                props.handleNext();
            }
        }
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