import React, { useState, useEffect } from "react";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'
import moment from "moment";
import Spinner from "../../../shared/Spinner";
import ReportingView from "./ReportingView";
import organizationServices from "../../../services/organization-service";
import Filter from "./Filter";
import { Drawer, useTheme } from "@mui/material";
import reportingServices from "../../../services/reporting-service";
import { commonOperator, dateOperator, timeOperator, objectIDOperator, parking, tickets_issued } from "../../../data/filterKeys";
import cityServices from "../../../services/city-service";
import userServices from "../../../services/user-service";
import Papa from 'papaparse'
import { config } from "../../../Constants";

export default function Reporting(props) {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);

  const [inputField, setInputField] = useState({});
  const [report, setReport] = useState([])
  const [total, setTotal] = useState({amount: 0, service_fee: 0})
  const [value, setValue] = useState({});
  const [selectedValue, setSelectedValue] = useState(null)
  const [selectedKey, setSelectedKey] = useState(null)
  const [filterBy, setFilterBy] = useState('parking')
  const [operator, setOperator] = useState({
    commonOperator: commonOperator,
    dateOperator: dateOperator,
    timeOperator: timeOperator,
    objectIDOperator: objectIDOperator,
  });
  const [selectedOperator, setSelectedOperator] = useState(null)

  const inputObj = {key: null, operator: null, value: null, condition: '', value2: null}
  const inputsArr = [inputObj]
  const [inputs, setInputs] = useState(inputsArr);
  const status = ['paid', 'unpaid']
  const user = JSON.parse(sessionStorage.getItem('userLogged'));
  const groupBy = ['Zone']
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(()=>{
    if(user?.result?.role !== 'root'){
      tickets_issued.splice(0, 1);
      parking.splice(0, 1);
      console.log(tickets_issued)
    }
  },[])

  const getOrganizations = async()=>{
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    setValue({...value, org: res.data})
    setSpinner(false);
  }
  
  const getCities = async()=>{
    setSpinner(true);
    const res = await cityServices.getCities({org_id: props.org._id});
    setValue({...value, city: res.data})
    setSpinner(false);
  }

  const getZones = async()=>{
    setSpinner(true);
    const res = await cityServices.getZones({org_id: props.org._id});
    setValue({...value, zone: res.data})
    setSpinner(false);
  }

  const getUsers = async()=>{
    setSpinner(true);
    const res = await userServices.getUsers({org_id: props.org._id});
    setValue({...value, user: res.data})
    setSpinner(false);
  }

  const getAgents = async()=>{
    setSpinner(true);
    const res = await userServices.getAgents();
    setValue({...value, issued_by: res.data})
    setSpinner(false);
  }

  const generateReport = async(e)=>{
    e.preventDefault();
    let body = [];
    if(user?.result?.role !== 'root'){
      body = [{
        condition: 'AND',
        key: {key: 'org', name: 'Organization'},
        operator: {key: '$eq', name: 'equal to'},
        value: props.org
      }];
      body = [...body, ...inputs];
    }else{
      body = inputs;
    }
    console.log(body)
    setSpinner(true);
    let res;
    if(filterBy == 'parking'){
      res = await reportingServices.generateReport(body);
    }else{
      res = await reportingServices.generateTicketIssuedReport(body);
    }
    if (selectedGroup == 'Zone') {
      var result = [];
      res.data.report.reduce(function (res, value) {
        console.log(value)
        if (!res[value.zone._id]) {
          res[value.zone._id] = { ...value, amount: 0, service_fee: 0, total_parking: 0 };
          result.push(res[value.zone._id])
        }
        res[value.zone._id].amount += value.amount;
        res[value.zone._id].service_fee += parseFloat(value.service_fee);
        res[value.zone._id].total_parking = res[value.zone._id].total_parking+1;
        return res;
      }, {});
      setReport(result)
    }else{
      setReport(res.data.report)
    }
    setTotal(res.data.total)
    setOpenDrawer(false);
    setSpinner(false);
  }

  const exportPDF = async()=>{
    // setSpinner(true);
    if(filterBy == 'parking'){
      createParkingReport();
    }else{
      createTicketingReport();
    }
  }

  const createTicketingReport = () => {
    let table = report.map(function(item){
      return {
        org: item.org?.org_name,
        city: item.city?.city_name,
        zone: item.zone?.zone_name,
        issued_by: item.issued_by?.email,
        ticket: item.ticket?.ticket_name,
        plate: item.plate,
        ticket_num: item.ticket_num,
        amount: (item.amount) ? '$ '+(item.amount/100).toFixed(2) : '',
        parking_status: item.parking_status,
        ticket_status: item.ticket_status,
        issued_at: moment(item.issued_at).format('MMM Do YY, hh:mm a'),
        paid_at: (item.paid_at !== undefined) ? moment(item.paid_at).format('MMM Do YY, hh:mm a') : '',
      }
    })
    Object.keys(total).forEach(function(key, index) {
      let label = key.replace(/_/g, ' ');
      label = label[0].toUpperCase() + label.slice(1);
      table = [...table, ...[{
        parking_status: { content: label, colspan: 2 },
        issued_at: { content: total[key], colspan: 1, styles: { halign: 'right' } }
      }]]
    });
    let columns = [
      { dataKey: 'org', header: 'Organization' },
      { dataKey: 'city', header: 'City' },
      { dataKey: 'zone', header: 'Zone' },
      { dataKey: 'ticket', header: 'Ticket' },
      { dataKey: 'issued_by', header: 'Issued By' },
      { dataKey: 'plate', header: 'Plate' },
      { dataKey: 'ticket_num', header: 'Ticket Number' },
      { dataKey: 'amount', header: 'Amount' },
      { dataKey: 'paid_at', header: 'Paid At' },
      { dataKey: 'parking_status', header: 'Parking Status' },
      { dataKey: 'ticket_status', header: 'Ticket Status' },
      { dataKey: 'issued_at', header: 'Issued At' },
    ];
    let filename = 'Tickets Issued Report'
    generatePdf(table, columns, filename)
  }

  const createParkingReport = () => {
    let table = report.map(function(item){
      return {
        org: item.org?.org_name,
        city: item.city?.city_name,
        zone: item.zone?.zone_name,
        user: item.user?.email,
        parking_id: item.parking_id,
        plate: item.plate,
        service_fee: '$ '+(parseInt(item.service_fee)/100).toFixed(2),
        amount: '$ '+(item.amount/100).toFixed(2),
        dateTime: moment(item.from).format('MMM Do YY, hh:mm a')+' - '+moment(item.to).format('MMM Do YY, hh:mm a'),
      }
    })
    table = [...table, ...[
      {
        amount: 'Total parkings',
        dateTime: { content: total.total_parkings, colspan: 1, styles: { halign: 'right' } }
      },
      {
        amount: 'Total plates',
        dateTime: { content: total.total_plates, colspan: 1, styles: { halign: 'right' } }
      },
      {
        amount: 'Service fee',
        dateTime: { content: '$ '+(parseInt(total.service_fee)/100).toFixed(2), colspan: 1, styles: { halign: 'right' } }
      },
      {
        amount: 'Amount',
        dateTime: { content: '$ '+(parseInt(total.amount)/100).toFixed(2), colspan: 1, styles: { halign: 'right' } }
      },
    ]]
    let columns = [
      { dataKey: 'org', header: 'Organization' },
      { dataKey: 'city', header: 'City' },
      { dataKey: 'zone', header: 'Zone' },
      { dataKey: 'user', header: 'Email' },
      { dataKey: 'parking_id', header: 'Parking Id' },
      { dataKey: 'plate', header: 'Plate' },
      { dataKey: 'service_fee', header: 'Service Fee' },
      { dataKey: 'amount', header: 'Amount' },
      { dataKey: 'dateTime', header: 'Start Date/Time - End Date/Time' },
    ];
    let filename = 'Parking Report'
    generatePdf(table, columns, filename)
  }

  const generatePdf = async(table, columns, filename)=>{
    var doc = new jsPDF({
      orientation: "landscape",
      format: "A3",
    });
    // setSpinner(true)

    getBase64ImageFromUrl(props.org._id)
    .then(result => {
      doc.autoTable({
        headStyles :{fillColor : theme.palette.primary.main, textColor: [255,255,255]},
        body: [...table],
        columnStyles: {
          2: {cellWidth: 50},
        },
        columns: columns,
        didDrawPage: function (data) {
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
          // Header
          doc.setFontSize(20);
          doc.setTextColor(theme.palette.primary.main);
          // var img = new Image(); //this mount a variable to img
          // img.src = require(config.url.file_url+props.org?.logo)
          doc.addImage(result, 'JPEG', data.settings.margin.left, 10, 60, 20);
          doc.text(filename, (pageWidth - 50)/2, 20);
  
          // Footer
          var str = "Page " + doc.internal.getNumberOfPages()
          doc.setFontSize(10);
          doc.text(str, data.settings.margin.left, pageHeight - 10);
          doc.text(moment().format('MMM Do YY, hh:mm a'), pageWidth - 50, pageHeight - 10);
          doc.text('© 2023 '+props.org?.org_name, (pageWidth - 50)/2, pageHeight - 10);
        },
        margin: {top: 40}
      });
      doc.save(filename+'.pdf', { returnPromise: true }).then(() => {
        setSpinner(false)
      });
    })
    .catch(err => console.error(err));
  }

  async function getBase64ImageFromUrl(id) {
    var res = await reportingServices.getOrgImage({id: id});
    return res.data
  }
  
  const onKeySelect = async(e, index)=>{
    if(e?.key == 'org'){
      getOrganizations();
    }else if(e?.key == 'city'){
      getCities();
    }else if(e?.key == 'zone'){
      getZones();
    }else if(e?.key == 'user'){
      getUsers();
    }else if(e?.key == 'issued_by'){
      getAgents();
    }else if(e?.key == 'ticket_status'){
      setValue({...value, ticket_status: status})
    }else
    setSelectedKey(e);
    if(e){
      setInputs(s => {
        const newArr = s.slice();
        newArr[index].key =  e;
        newArr[index].operator =  null;
        newArr[index].value =  null;
        newArr[index].condition =  null;
        newArr[index].value2 =  null;
        return newArr;
      });
    }
  }

  const onOperatorSelect = async(e, index)=>{
    console.log(e)
    setInputs(s => {
      const newArr = s.slice();
      newArr[index].operator =  e;
      return newArr;
    });
    setSelectedOperator(e)
  }

  const onValueSelect = async(e, index)=>{
    console.log(e);
    setSelectedValue(e);
    setInputs(s => {
      const newArr = s.slice();
      newArr[index].value =  e;
      return newArr;
    });
    console.log(inputs)
  }

  const addInput = (e, index) => {
    setInputs(s => {
      const newArr = s.slice();
      newArr[index].condition =  e;
      return newArr;
    });
    console.log(inputs,index)
    if(inputs.length-1 == index){
      setInputs(s => {return [ ...s, inputObj]});
    }
  };

  const delInput = (index)=>{
    let clone = [...inputs];
    clone.splice(index , 1);
    setInputs(clone);
  }

  const handleInputChange = (e) => {
    const index = e.target.id;
    setInputs(s => {
      const newArr = s.slice();
      newArr[index][e.target.name] =  e.target.checked || e.target.value;
      return newArr;
    });
  };

  const onFilterChange = (e) =>{
    setFilterBy(e);
    setInputs(inputsArr);
    setReport([]);
    setTotal({amount: 0, service_fee: 0});
  }

  const exportCSV = async () => {
    let data = [];
    let emptyColumns = {};
    let summaryKeys = {key1: 'Amount', key2: 'Start Date/Time - End Date/Time'}
    if(selectedGroup == 'Zone'){
      data = report.map(function (item) {
        return {
          Organization: item.org?.org_name,
          "City Name": item.city?.city_name,
          "Zone Name": item.zone?.zone_name,
          "Total Parking" : item.total_parking,
          "Service Fee": '$ ' + (parseInt(item.service_fee) / 100).toFixed(2),
          Amount: '$ ' + (item.amount / 100).toFixed(2)
        }
      })
      emptyColumns = {
        Organization: "",
        "City Name": "",
        "Zone Name": "",
        "Total Parking": "",
      }
      summaryKeys = {key1: 'Service Fee', key2: 'Amount'}
    }else{
      data = report.map(function (item) {
        return {
          Organization: item.org?.org_name,
          "City Name": item.city?.city_name,
          "Zone Name": item.zone?.zone_name,
          Email: item.user?.email,
          "Parking ID": item.parking_id,
          Plate: item.plate,
          "Service Fee": '$ ' + (parseInt(item.service_fee) / 100).toFixed(2),
          Amount: '$ ' + (item.amount / 100).toFixed(2),
          "Start Date/Time - End Date/Time": moment(item.from).format('MMM Do YY, hh:mm a') + ' - ' + moment(item.to).format('MMM Do YY, hh:mm a'),
        }
      })
      emptyColumns = {
        Organization: "",
        "City Name": "",
        "Zone Name": "",
        Email: "",
        "Parking ID": "",
        Plate: "",
        "Service Fee": "",
      }
    }
    let total_summary = [
      {
        ...emptyColumns,
        [summaryKeys.key1]: "Parkings",
        [summaryKeys.key2]: total.total_parkings,
      },
      {
        ...emptyColumns,
        [summaryKeys.key1]: "Plates",
        [summaryKeys.key2]: total.total_plates,
      },
      {
        ...emptyColumns,
        [summaryKeys.key1]: "Service Fee",
        [summaryKeys.key2]: '$ ' + (parseInt(total.service_fee) / 100).toFixed(2),
      },
      {
        ...emptyColumns,
        [summaryKeys.key1]: "Total Amount",
        [summaryKeys.key2]: '$ ' + (parseInt(total.amount) / 100).toFixed(2),
      }
    ]
    data = [...data, ...total_summary];
    
    var csv = Papa.unparse(data);

    var csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    var csvURL =  null;
    if (navigator.msSaveBlob)
    {
        csvURL = navigator.msSaveBlob(csvData, 'parking_report.csv');
    }
    else
    {
        csvURL = window.URL.createObjectURL(csvData);
    }

    var tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'parking_report.csv');
    tempLink.click();
  }

  return (
    <>
      <ReportingView
        filterBy={filterBy}
        report = {report}
        total = {total}
        literals={props.literals}
        selectedGroup={selectedGroup}

        setOpenDrawer={()=>{setOpenDrawer(!openDrawer)}}
        exportPDF={()=>exportPDF()}
        exportCSV={() => exportCSV()}
      />
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#fff !important",
            width:
              window.innerWidth > 700
                ? "70% !important"
                : "100% !important",
          },
        }}
        anchor={'right'}
        open={openDrawer}
        onClose={()=>setOpenDrawer(false)}
      >
        <Filter
          inputField={inputField}
          // btn={btn}
          value = {value}
          keys={(filterBy === 'parking') ? parking : tickets_issued}
          operator={operator}
          selectedKey={selectedKey}
          selectedOperator={selectedOperator}
          selectedValue={selectedValue}
          inputs={inputs}
          literals = {props.literals}
          filterBy={filterBy}
          groupBy={groupBy}
          selectedGroup={selectedGroup}

          onKeySelect={(e, index)=>onKeySelect(e, index)}
          onOperatorSelect={(e, index)=>onOperatorSelect(e, index)}
          onValueSelect={(e, index)=>onValueSelect(e, index)}
          onClose={()=>setOpenDrawer(false)}
          addInput={(e, index)=>addInput(e, index)}
          delInput={(e)=>delInput(e)}
          handleInputChange={(e)=>handleInputChange(e)}
          generateReport={(e)=>generateReport(e)}
          setFilterBy={(e)=>onFilterChange(e.target.value)}
          setSelectedGroup={(e) => setSelectedGroup(e)}
        />
      </Drawer>
      <Spinner
        spinner = {spinner}
      />
      {/* <ConfirmDiallog
        openDialog = {openDialog}

        closeDialog = {()=>setOpenDialog(false)}
        delItem = {()=>delItem()}
      /> */}
    </>
  );
}
