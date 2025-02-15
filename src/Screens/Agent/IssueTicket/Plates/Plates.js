import React, { useEffect, useState } from 'react';
import PlatesView from './PlatesView';
import Spinner from '../../../../shared/Spinner';
import ticketServices from '../../../../services/ticket-service';
import parkingService from '../../../../services/parking-service';
import scanPlateServices from '../../../../services/scan-plate-service';


export default function Plates(props) {
    const [plates, setPlates] = useState([]);
    const [fiteredPlates, setFiteredPlates] = useState([]);
    const [parkings, setParkings] = useState([]);
    const [spinner, setSpinner] = useState(false);
    const user = JSON.parse(sessionStorage.getItem('userLogged'));

    useEffect(() => {
        getPlates();
    }, [])

    const getPlates = async()=>{
        setSpinner(true);
        const res = await parkingService.getParkingsByCity({city_id: props.inputField.city});
        const getScanPlates = await scanPlateServices.getScanPlatesByToken(user.token);
        console.log(getScanPlates)
        let flatPlates = [];
        let allPlates = [];
        res.data.forEach(element => {
            const isPlateScanned = getScanPlates.data.find(x => x.plate == element.plate || x.plate == element.plate_two || x.plate == element.plate_three);
            if(isPlateScanned)
                flatPlates.push({...element, checked_status: isPlateScanned.plate == element.plate ? 'Paid' : 'Shared Violation'});
            else
                flatPlates.push(element);
            let tempPlate = [];
            tempPlate.push({plate: element.plate, status: element.zone?._id == props.inputField.zone ? 'Paid' : 'Paid in another zone', plateChecked: false});
            if(element.plate_two){
                tempPlate.push({plate: element.plate_two, status: element.zone?._id == props.inputField.zone ? 'Paid' : 'Paid in another zone', plateChecked: false});
                if(isPlateScanned)
                    flatPlates.push({...element, plate: element.plate_two, checked_status: isPlateScanned.plate == element.plate_two ? 'Paid' : 'Shared Violation'});
                else
                    flatPlates.push({...element, plate: element.plate_two});
            }
            if(element.plate_three){
                tempPlate.push({plate: element.plate_three, status: element.zone?._id == props.inputField.zone ? 'Paid' : 'Paid in another zone', plateChecked: false});
                if(isPlateScanned)
                    flatPlates.push({...element, plate: element.plate_three, checked_status: isPlateScanned.plate == element.plate_three ? 'Paid' : 'Shared Violation'});
                else
                    flatPlates.push({...element, plate: element.plate_three});
            }
            allPlates.push(tempPlate);
        });
        console.log(allPlates)
        setPlates(allPlates);
        setParkings(flatPlates);
        setFiteredPlates(flatPlates);
        setSpinner(false);
    }

    const handleSearch = async (value) => {
        let filteredRows = parkings.filter((row) => {
            return row.plate.toLowerCase()?.includes(value.toLowerCase())
        });
        if(!filteredRows.length){
            filteredRows = [{
                plate: value.toUpperCase()
            }]
            props.setInputField({...props.inputField, plate: value.toUpperCase()});
        }else{
            props.setInputField({...props.inputField, plate: null});
        }
        setFiteredPlates(filteredRows);
    }

    const clearSearch = () => {
        let inputField = props.inputField;
        inputField.plate = '';
        props.setInputField(inputField);
        setFiteredPlates(parkings);
    }

    const checkStatus = async (item) => {
        let allPlates = [...plates];
        allPlates.forEach((x, index)=>{
            const findIndex = x.findIndex(y => y.plate == item.plate);
            if(findIndex > -1 && !x[findIndex].plateChecked){
                let allParkings = [...parkings];
                x.map((obj)=>{
                    allParkings[allParkings.findIndex(z => z.plate == obj.plate)].checked_status = 'Shared Violation';
                    allParkings[allParkings.findIndex(z => z.plate == item.plate)].checked_status = 'Paid';
                    obj.checked_status = 'Shared Violation';
                    obj.plateChecked = true;
                    return obj;
                })
                setParkings(allParkings)
                allPlates[index][findIndex].checked_status = 'Paid';
            }
        })
        setPlates(allPlates);
         // setSpinner(true);
        // const user = JSON.parse(sessionStorage.getItem('userLogged'));
        // const getScanPlates = await scanPlateServices.getScanPlatesByToken(user.token);
        // const isPlateAlreadyScanned = getScanPlates.data.find(x => x.plate == item.plate);
        // if(!isPlateAlreadyScanned){
            await scanPlateServices.addScanPlate({
                session_token: user.token,
                plate: item.plate,
                org: user.result.org._id,
                user: user.result._id
            });
        // }
        // setSpinner(false);
    }
    return (
        <>
            <PlatesView
                org={props.org}
                literals={props.literals}
                plates={fiteredPlates}
                inputField={props.inputField}

                handleSearch={(e) => handleSearch(e.target.value)}
                checkStatus={(e) => checkStatus(e)}
                handlePlateSelect={(e)=> props.setInputField({...props.inputField, ...e})}
                clearSearch={() => clearSearch()}
            />
            <Spinner
                spinner = {spinner}
            />
        </>
    );
}