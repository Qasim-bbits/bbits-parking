import React, {useState, useEffect} from "react";
import Alert from "../../../Common/Alerts";
import Spinner from "../../../Common/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import EditRate from "./EditRate";
import AddRate from "./AddRate";
import RatesView from "./RatesView";
import rateServices from "../../../services/rate-service";
import cityServices from "../../../services/city-service";

export default function RatesUtils(props) {
  const [spinner, setSpinner] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openAddDrawer, setOpenAddDrawer] = useState(false);
  const [alertMessage, setMsg] = useState('');
  const [showAlert, setAlert] = useState(false);
  const [severity, setSeverity] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [inputField, setInputField] = useState({});
  const [inputAddField, setInputAddField] = useState({});
  const [inputRateSteps, setInputRateSteps] = useState({});
  const [zones, setZones] = useState([]);
  const [rates, setRates] = useState([]);
  const [rateDetail, setRateDetail] = useState([]);
  const [rateSteps, setRateSteps] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedRate, setSelectedRate] = useState(null);
  const [zoneId, setZoneId] = useState("");
  const [btn, setBtn] = useState(props.literals.add);
  const [rateType, setRateType] = useState('regular');
  const [editId, setEditId] = useState('');
  const inputArr = [{rate: 0, time: 0}];
  const stepsArr = [{
    rate_type_name: '', start_time: '', end_time: '', 
    Monday: false, Tuesday: false, Wednesday: false, 
    Thursday: false, Friday: false, Saturday: false, Sunday: false, 
    rate_steps: inputArr
  }]
  const [steps, setSteps] = useState(stepsArr);

  useEffect(()=>{
    getZones();
  },[])

  const getZones = async()=>{
    setSpinner(true);
    const res = await cityServices.getZones({org_id: props.org._id});
    setZones(res.data)
    setSpinner(false);
  }

  const onZoneSelected = async (e)=>{
    setSelectedZone(e);
    setSelectedRate(null);
    setSpinner(true);
    const res = await rateServices.getRateByZone({id: e._id});
    setRates(res.data)
    if(res.data.length === 1){
      setSelectedRate(res.data[0])
    }
    setSpinner(false);
  }

  const getRateDetail = async(e)=>{
    setSpinner(true);
    setZoneId(e);
    const res = await rateServices.getRateDetail({zone_id : e});
    setRateDetail(res.data);
    setSpinner(false);
  }

  const onRateType = (e)=>{
    setRateType(e.target.value);
  }

  const handleChange = (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.value});
  }

  const handleAddChange = (e)=> {
    setInputAddField({...inputAddField, [e.target.name] : e.target.value});
  }

  const handleCheck =  (e)=> {
    setInputField({...inputField, [e.target.name] : e.target.checked});
  }

  const handleAddCheck =  (e)=> {
    setInputAddField({...inputAddField, [e.target.name] : e.target.checked});
  }

  const handleRateChange = (e, index)=> {
    let clone = [...rateSteps];
    let obj = clone[index];
    obj[e.target.name] = parseInt(e.target.value);
    clone[index] = obj;
    setRateSteps([...clone])
  }

  const handleSubmit = async(e)=> {
    e.preventDefault();
    setSpinner(true);
    let obj = {...inputField};
    const rate_step = rateSteps.map((y)=>{
      return{
        _id : y._id,
        rate : y[y._id+"_rate"],
        time : y[y._id+"_time"]
      }
    })
    obj['rate_step'] = rate_step
    const stepRes = await rateServices.bulkEditSteps(obj);
    setMsg(props.literals.rate_updated_successfully);
    setSeverity('success');
    setAlert(true);
    getRateDetail(zoneId);
    setOpenDrawer(false)
    setSpinner(false);
  }

  const handleAddSubmit = async(e, steps)=> {
    e.preventDefault();
    setSpinner(true);
    let body = {};
    body['rate_name']= inputAddField["rate_name"];
    body['zone_id']= selectedZone._id;
    body['rate_type']= 0;
    body['qr_code']= false;
    body['service_fee']=parseInt(inputAddField['service_fee']);
    body['rates'] = steps;
    if(rateType === 'special'){
      body['rates'].map(x=>{
        x['start_date'] = inputAddField['start_date']
        x['end_date'] = inputAddField['end_date']
        x['special_rate'] = true;
        x['rate_type_id'] = selectedRate._id;
      })
      const res = rateServices.addSpecialRate(body);
    }else{
      body['rates'].map(x=>{
        x['special_rate'] = false;
      })
      const res = rateServices.addCompleteRate(body);
    }
    reset();
    setMsg(props.literals.rate_added_successfully);
    setSeverity('success');
    setAlert(true);
    setOpenAddDrawer(false)
    setSpinner(false);
  }
  
  const editItem = async(e)=> {
    const rate_step = e.rate_step.map((y)=>{
      return{
        _id : y._id,
        [y._id+"_rate"] : y.rate,
        [y._id+"_time"] : y.time
      }
    })
    if(e.start_date !== undefined && e.end_date !== undefined){
      e.start_date = convertToDatetime(e.start_date);
      e.end_date = convertToDatetime(e.end_date);
    }
    setRateSteps(rate_step);
    setInputRateSteps(rate_step)
    setInputField(e);
    setBtn(props.literals.update)
    setOpenDrawer(true)
  }

  const convertToDatetime = (dt) =>{
    console.log(dt)
    var now = new Date(dt);
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0,16);
  }

  const delItem = async ()=>{
    setSpinner(true);
    const res = await rateServices.delRateType({id: editId});
    if(res.data.deletedCount > 0){
      getRateDetail(zoneId);
      setMsg(props.literals.rate_deleted_successfuly)
      setSeverity('success')
    }else{
      setMsg(props.literals.unable_to_delete)
      setSeverity('error')
      setSpinner(false);
    }
    setOpenDialog(false);
    setAlert(true)
  }

  const reset = () =>{
    setInputAddField({});
    setSteps(stepsArr);
  }
  
  const addInput = (e, index) => {
    console.log(steps,index);
    let clone = [...steps];
    clone[index].rate_steps.push({rate: 0,time: 0})
    setSteps(clone);
  };

  const delInput = (i, index)=>{
    let clone = [...steps];
    clone[index].rate_steps.splice(i , 1);
    setSteps(clone);
  }

  const inputChange = (e, index) => {
    const i = e.target.id;
    setSteps(s => {
      const newArr = s.slice();
      newArr[index].rate_steps[i][e.target.name] = e.target.value;
      return newArr;
    });
  };

  const addStep = () => {
    setSteps(s => {return [ ...s,{
        rate_type_name: '', start_time: '', end_time: '', 
        Monday: false, Tuesday: false, Wednesday: false, 
        Thursday: false, Friday: false, Saturday: false, Sunday: false, 
        rate_steps: inputArr
      }];
    });
  };

  const delStep = (index)=>{
    let clone = [...steps];
    clone.splice(index , 1);
    setSteps(clone);
  }

  const handleStepChange = (e) => {
    const index = e.target.id;
    setSteps(s => {
      const newArr = s.slice();
      newArr[index][e.target.name] =  e.target.checked || e.target.value;
      return newArr;
    });
  };

  return (
    <>
      {zones.length > 0 && <RatesView
        inputField = {inputField}        
        zones = {zones}
        rateDetail = {rateDetail}
        literals = {props.literals}

        setOpenAddDrawer = {()=> setOpenAddDrawer(!openAddDrawer)}
        getRateDetail = {(e)=>getRateDetail(e)}
        editItem = {(e)=>editItem(e)}
        delItem={(id) => {setEditId(id); setOpenDialog(true)}}
        setOpenDrawer={()=>setOpenDrawer(!openDrawer)}
      />}
      <EditRate
        zones = {zones}
        selectedZone = {selectedZone}
        openDrawer = {openDrawer}
        inputField = {inputField}
        inputRateSteps = {inputRateSteps}
        btn = {btn}
        rateSteps = {rateSteps}
        literals = {props.literals}

        handleChange = {(e)=>handleChange(e)}
        handleCheck = {(e)=>handleCheck(e)}
        handleRateChange = {(e, index)=>handleRateChange(e, index)}
        handleSubmit = {(e)=>handleSubmit(e)}
        setOpenDrawer = {()=> setOpenDrawer(!openDrawer)}
        setSelectedZone = {(e)=> setSelectedZone(e)}
      />
      <AddRate
        zones = {zones}
        selectedZone = {selectedZone}
        openAddDrawer = {openAddDrawer}
        inputAddField = {inputAddField}
        btn = {btn}
        rateType = {rateType}
        rates = {rates}
        selectedRate = {selectedRate}
        literals = {props.literals}
        inputArr = {inputArr}
        stepsArr = {stepsArr}
        steps = {steps}

        handleAddChange = {(e)=>handleAddChange(e)}
        handleAddCheck = {(e)=>handleAddCheck(e)}
        handleAddSubmit = {(e, steps)=>handleAddSubmit(e, steps)}
        setOpenAddDrawer = {()=> setOpenAddDrawer(!openAddDrawer)}
        onZoneSelected = {(e)=> onZoneSelected(e)}
        setSelectedRate = {(e)=> setSelectedRate(e)}
        onRateType = {(e)=> onRateType(e)}
        handleStepChange = {(e)=> handleStepChange(e)}
        delStep = {(e)=> delStep(e)}
        addStep = {(e)=> addStep(e)}
        inputChange = {(e, index)=> inputChange(e, index)}
        delInput = {(e, index)=> delInput(e, index)}
        addInput = {(e, index)=> addInput(e, index)}
        
      />
      <Alert
        alertMessage = {alertMessage}
        showAlert = {showAlert}
        severity = {severity}
        
        closeAlert = {()=>setAlert(!showAlert)}
      />
      <Spinner
        spinner = {spinner}
      />
      <ConfirmDiallog
        openDialog = {openDialog}

        closeDialog = {()=>setOpenDialog(false)}
        delItem = {()=>delItem()}
      />
    </>
  );
}
