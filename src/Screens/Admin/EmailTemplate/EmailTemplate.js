import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import ConfirmDiallog from "../../../shared/ConfirmDiallog";
import emailTemplateServices from "../../../services/email-template-service";
import AddEmailTemplate from "./AddEmailTemplate";
import EmailTemplatesView from "./EmailTemplatesView";
import organizationServices from "../../../services/organization-service";

export default function EmailTemplate(props) {
  const [openDialog, setOpenDialog] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [inputField, setInputField] = useState({template: ''});
  const [emailTemplates, setEmailTemplates] = useState([])
  const [selectedOrg, setSelectedOrg] = useState(null)
  const [organizations, setOrganizations] = useState([]);
  const [editId, setEditId] = useState('');
  const [btn, setBtn] = useState(props.literals.add);
  const user = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(() => {
    getOrganizations();
    getEmailTemplates();
  }, [])

  const getOrganizations = async () => {
    setSpinner(true);
    const res = await organizationServices.getOrganizations();
    if (user.result?.role !== 'root') {
      let org = res.data.filter(x => x._id == props.org._id);
      setSelectedOrg(org[0])
    }
    setOrganizations(res.data)
    setSpinner(false);
  }

  const getEmailTemplates = async () => {
    setSpinner(true);
    const res = await emailTemplateServices.getEmailTemplates({ org_id: props.org._id });
    setEmailTemplates(res.data)
    setSpinner(false);
  }

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    inputField['org'] = selectedOrg._id;
    if (btn === props.literals.add) {
      const res = await emailTemplateServices.addEmailTemplate(inputField);
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
      const res = await emailTemplateServices.editEmailTemplate(inputField);
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
    getEmailTemplates();
    reset();
  };

  const delItem = async () => {
    setSpinner(true);
    const res = await emailTemplateServices.delEmailTemplate({ id: editId });
    if (res.data.deletedCount === 1)
      setEmailTemplates(emailTemplates.filter(function (obj) {
        return obj._id !== editId;
      }))
    setSpinner(false);
    setOpenDialog(false);
    setMsg(props.literals.template_deleted_successfuly)
    setSeverity('success')
    setAlert(true)
  }

  const onEdit = async (e) => {
    setSelectedOrg(e.org);
    setInputField(e)
    setOpenDrawer(true);
    setEditId(e._id);
    setBtn(props.literals.update);
  }

  const reset = () => {
    setInputField({template: ''});
    setOpenDrawer(false);
    setEditId('');
    setBtn(props.literals.add);
  }

  return (
    <>
      <EmailTemplatesView
        emailTemplates={emailTemplates}
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
        <AddEmailTemplate
          inputField={inputField}
          organizations={organizations}
          selectedOrg={selectedOrg}
          user={user}
          btn={btn}
          literals={props.literals}

          setSelectedOrg={(e)=>setSelectedOrg(e)}
          handleChange={(e) => handleChange(e)}
          handleSubmit={(e) => handleSubmit(e)}
          onTemplateChange={(e) => setInputField({ ...inputField, template: e })}
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
