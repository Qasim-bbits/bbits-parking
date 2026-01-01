import React, { useState, useEffect, useRef } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import virtualMeterAdServices from "../../../services/virtual-meter-ad-service";
import organizationServices from "../../../services/organization-service";
import VirtualMeterAdsView from "./VirtualMeterAdsView";
import AddVirtualMeterAd from "./AddVirtualMeterAd";
import cityServices from "../../../services/city-service";
import moment from "moment-timezone";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export default function VirtualMeterAd(props) {
  const quillRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({ template: '' });
  const [virtualMeterAds, setVirtualMeterAds] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [selectedZone, setSelectedZone] = useState(null)
  const [organizations, setOrganizations] = useState([]);
  const [zones, setZones] = useState([]);
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(() => {
    getOrganizations();
    getVirtualMeterAds();
  }, [])

  const getOrganizations = async () => {
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    if (user.result?.role !== 'root') {
      let org = res.data.filter(x => x._id == props.org._id);
      setSelectedOrg(org[0]);
      getZones(org[0]._id);
    } else {
      getZones(props.org._id);
    }
    setOrganizations(res.data)
    setSpinner(false);
  }

  const getZones = async (org_id) => {
    setSpinner(true);
    const res = await cityServices.getZones({ org_id: org_id });
    setZones(res.data)
    setSpinner(false);
    setSpinner(false);
  }

  const getVirtualMeterAds = async () => {
    setSpinner(true);
    const res = await virtualMeterAdServices.getVirtualMeterAds({ org_id: props.org._id });
    setVirtualMeterAds(res.data)
    setSpinner(false);
  }

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const delta = quillRef.current.getEditor().getContents();
    const converter = new QuillDeltaToHtmlConverter(delta.ops, {
      inlineStyles: true,
      inlineStyles: {
        align: {
          center: "text-align: center",
          right: "text-align: right",
          justify: "text-align: justify",
        },
        size: {
          small: "font-size: 0.75em",
          large: "font-size: 1.5em",
          huge: "font-size: 2.5em",
        },
        indent: {
          1: "margin-left: 3em",
          2: "margin-left: 6em",
        },
        color: (value) => `color: ${value}`, // supports ql-color
        background: (value) => `background-color: ${value}`, // supports ql-bg
      },  
    });
    inputField['compaign'] = converter.convert();
    inputField['org'] = selectedOrg._id;
    inputField['zone'] = selectedZone._id;
    if (btn === props.literals.add) {
      const res = await virtualMeterAdServices.addVirtualMeterAd(inputField);
      if (res.data.msg) {
        setMsg(res.data.msg);
        setSeverity('error');
        setAlert(true);
        return;
      }
      setMsg(props.literals.template_added_successfully);
      setSeverity('success');
      setAlert(true);
    } else {
      inputField['id'] = editId;
      const res = await virtualMeterAdServices.editVirtualMeterAd(inputField);
      if (res.data.msg) {
        setMsg(res.data.msg);
        setSeverity('error');
        setAlert(true);
        return;
      }
      setBtn(props.literals.add)
      setMsg(props.literals.template_updated_successfully);
      setSeverity('success');
      setAlert(true);
    }
    getVirtualMeterAds();
    reset();
  };

  const delItem = async () => {
    setSpinner(true);
    const res = await virtualMeterAdServices.delVirtualMeterAd({ id: editId });
    if (res.data.deletedCount === 1)
      setVirtualMeterAds(virtualMeterAds.filter(function (obj) {
        return obj._id !== editId;
      }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.template_deleted_successfuly)
    setSeverity('success')
    setAlert(true)
  }

  const onEdit = async (e) => {
    setSpinner(true);
    const res = await virtualMeterAdServices.getVirtualMeterAdById({ id: e._id });
    setSelectedOrg(res.data.org);
    setSelectedZone(res.data.zone);
    setInputField({
      ...res.data,
      start_date: moment(res.data.start_date).tz(res.data?.zone?.city_id?.time_zone || 'America/New_York').format('YYYY-MM-DDTHH:mm'),
      end_date: moment(res.data.end_date).tz(res.data?.zone?.city_id?.time_zone || 'America/New_York').format('YYYY-MM-DDTHH:mm')
    })
    setOpenDrawer(true);
    setEditId(e._id);
    setBtn(props.literals.update);
    setSpinner(false);
  }

  const reset = () => {
    setInputField({ template: '' });
    setOpenDrawer(false);
    setEditId('');
    setBtn(props.literals.add);
  }

  return (
    <>
      <VirtualMeterAdsView
        virtualMeterAds={virtualMeterAds}
        literals={props.literals}

        onEdit={(e) => onEdit(e)}
        delItem={(id) => { setEditId(id); setOpenDialog(true) }}
        setOpenDrawer={() => setOpenDrawer(!openDrawer)}
      />
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#fff !important",
            width:
              window.innerWidth > 700
                ? "50% !important"
                : "100% !important",
          },
        }}
        anchor={'right'}
        open={openDrawer}
        onClose={() => reset()}
      >
        <AddVirtualMeterAd
          quillRef={quillRef}
          inputField={inputField}
          organizations={organizations}
          zones={zones}
          selectedOrg={selectedOrg}
          selectedZone={selectedZone}
          user={user}
          btn={btn}
          literals={props.literals}

          setSelectedOrg={(e) => setSelectedOrg(e)}
          setSelectedZone={(e) => setSelectedZone(e)}
          handleChange={(e) => handleChange(e)}
          handleSubmit={(e) => handleSubmit(e)}
          onTemplateChange={(e) => setInputField({ ...inputField, compaign: e })}
          onClose={() => reset()}
        />
      </Drawer>

      <SnackAlert
        msg={msg}
        alert={alert}
        severity={severity}

        closeAlert={() => setAlert(!alert)}
      />
      <Spinner
        spinner={spinner}
      />
      <ConfirmDiallog
        openDialog={openDialog}

        closeDialog={() => setOpenDialog(false)}
        delItem={() => delItem()}
      />
    </>
  );
}
