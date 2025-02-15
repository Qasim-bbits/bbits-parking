import React, { useEffect, useState } from 'react';
import VisitorPassView from './VisitorPassView';
import mainService from '../../services/main-service';
import { useNavigate, useParams } from 'react-router-dom';
import { router } from '../../Routes/routhPaths';
import rateServices from '../../services/rate-service';
import Spinner from '../../Common/Spinner';
import parkingService from '../../services/parking-service';
import Alert from "../../Common/Alerts";
import Receipt from './receipt';

export default function VisitorPass(props) {
    let navigate = useNavigate();
    let { id } = useParams();
    const [showSpinner, setShowSpinner] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [severity, setSeverity] = useState('');
    const [inputField, setInputField] = useState({});
    const [zone, setZone] = useState({});
    const [rates, setRates] = useState([]);
    const [rateStep, setRateStep] = useState({});
    const [selectedRate, setSelectedRate] = useState({});
    const [parking, setParking] = useState({});
    const [showReceipt, setShowReceipt] = useState(false);

    useEffect(() => {
        getZonebyId();
    }, [])

    const getZonebyId = async () => {
        setShowSpinner(true);
        const res = await mainService.getZonebyId({ id: id, org_id: props.org._id });
        if(res.data.length){
            setZone(res.data[0]);
            getVisitorPassRate(res.data[0]._id, res.data[0].city_id.time_zone);
        }else{
            navigate(router.login)
        }
        setShowSpinner(false);
    }

    const getVisitorPassRate = async (zone_Id, time_zone) => {
        setShowSpinner(true);
        const res = await rateServices.getVisitorPassRate(zone_Id);
        if(res.data.length){
            setRates(res.data);
            setSelectedRate(res.data[0]);
            const rateSteps = await getRateSteps(res.data[0]._id, time_zone);
            if(rateSteps.length){
                setRateStep(rateSteps[0]);
            }else{
                setAlertMessage(rateSteps.msg);
                setSeverity("error");
                setShowAlert(true);
                return;
            }
        }else{
            navigate(router.login)
        }
        setShowSpinner(false);
    }

    const getRateSteps = async (rate_id, time_zone) => {
        setShowSpinner(true);
        const res = await mainService.getRateSteps({id: rate_id, time_zone: time_zone});
        setShowSpinner(false);
        return res.data;
    }

    const onRateChange = async (rate) => {
        setSelectedRate(rate);
        const rateSteps = await getRateSteps(rate._id, zone?.city_id?.time_zone);
        if(rateSteps.length){
            setRateStep(rateSteps[0]);
        }else{
            setAlertMessage(rateSteps.msg);
            setSeverity("error");
            setShowAlert(true);
            return;
        }
    }
        

    const onSubmit = async (e) => {
        e.preventDefault();
        const rateSteps = await getRateSteps(selectedRate._id, zone?.city_id?.time_zone);
        if(rateSteps.length){
            setRateStep(rateSteps[0]);
        }else{
            setAlertMessage(rateSteps.msg);
            setSeverity("error");
            setShowAlert(true);
            return;
        }
        let body = {
            paymentMethod: '',
            amount: 0,
            plate: inputField.plate,
            zone: zone._id,
            city: zone.city_id,
            from: rateSteps[0].current_time,
            to: rateSteps[0].time_desc,
            rate: selectedRate._id,
            service_fee: 0,
            org: props.org._id
          }
          const res = await parkingService.buyVisitorPass(body);
          if(res.data.msg){
            setAlertMessage(res.data.msg);
            setSeverity("error");
            setShowAlert(true);
          }else{
            setParking({
                ...res.data,
                zone: zone,
                city: zone.city_id,
                rate: selectedRate,
                org: props.org
            })
            setShowReceipt(true)
          }
    }

    const reset = () => {
        onRateChange(rates[0]);
        setInputField({plate: ''})
        setShowReceipt(false);
    }

    return (
        <>
            {!showReceipt && <VisitorPassView
                org={props.org}
                literals={props.literals}
                rates={rates}
                zone={zone}
                selectedRate={selectedRate}
                rateStep={rateStep}
                inputField={inputField}

                onChange={(e)=> setInputField({...inputField, [e.target.name] : e.target.value.toUpperCase()})}
                onRateChange={(e) => onRateChange(e)}
                onSubmit={onSubmit}
            />}
            {showReceipt &&<Receipt
                parking={parking}
                selectedRate={selectedRate}
                literals={props.literals}

                reset={reset}
            />}
            <Spinner
                spinner = {showSpinner}
            />
            <Alert
                alertMessage = {alertMessage}
                showAlert = {showAlert}
                severity = {severity}
                
                closeAlert = {()=>setShowAlert(!showAlert)}
            />
        </>
    );
}