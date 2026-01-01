import React, { useMemo, useState } from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete } from "@mui/material";
import { Close } from "@mui/icons-material";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import virtualMeterAdServices from "../../../services/virtual-meter-ad-service";
import Spinner from "../../../shared/Spinner";
import SnackAlert from "../../../shared/SnackAlert";

export default function AddVirtualMeterAd(props) {
  const [spinner, setSpinner] = useState(false);
  const [msg, setMsg] = useState("");
  const [alert, setAlert] = useState(false);
  const [severity, setSeverity] = useState("");

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  // Custom Image Handler
  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      // ✅ Size check
      if (file.size > MAX_IMAGE_SIZE) {
        setMsg("Image size must be less than 2MB");
        setSeverity('error');
        setAlert(true);
        return;
      }

      const formData = new FormData();
      formData.append("compaign", file);

      // upload to backend
      setSpinner(true);
      const res = await virtualMeterAdServices.upload_compaign(formData);
      setSpinner(false);
      const data = await res.data;

      const quill = props.quillRef.current.getEditor();
      const range = quill.getSelection();
      if (range && range.index !== null) {
        quill.insertEmbed(range.index, "image", data.url);
        quill.setSelection(range.index + 1); // move cursor after image
      } else {
        quill.insertEmbed(quill.getLength(), "image", data.url);
      }
    };
  };

  // Toolbar with custom image handler
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'font': [] }, { 'size': [] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['image', 'link']
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }), []);

  return (
    <Box component="form" onSubmit={props.handleSubmit} sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ placeContent: "center" }}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
            {props.btn} {props.literals.virtual_meter_ads}
          </Typography>
        </Grid>
        <Grid item xs={6} align='right'>
          <IconButton color="primary" aria-label="upload picture" component="label" onClick={props.onClose}>
            <Close />
          </IconButton>
        </Grid>
        <Grid item xs={12} align="right">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={props.organizations}
            getOptionLabel={(option) => option.org_name}
            value={props.selectedOrg}
            readOnly={(props.user?.result?.role !== 'root') ? true : false}
            onChange={(event, newValue) => props.setSelectedOrg(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={props.literals.select_organization} color="primary" size="small" required />
            )}
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={props.zones}
            getOptionLabel={(option) => option.zone_name}
            value={props.selectedZone}
            onChange={(event, newValue) => props.setSelectedZone(newValue)}
            renderInput={(params) => (
              <TextField {...params} label={props.literals.select_zone} color="primary" size="small" required />
            )}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-error-helper-text"
            label={props.literals.start_date}
            color="primary"
            type="datetime-local"
            name="start_date"
            value={props.inputField["start_date"]}
            InputLabelProps={{ shrink: true }}
            onChange={props.handleChange}
            size="small"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-error-helper-text"
            label={props.literals.end_date}
            color="primary"
            type="datetime-local"
            name="end_date"
            value={props.inputField["end_date"]}
            InputLabelProps={{ shrink: true }}
            onChange={props.handleChange}
            size="small"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <ReactQuill
            ref={props.quillRef}
            theme="snow"
            value={props.inputField["compaign"]}
            onChange={props.onTemplateChange}
            modules={modules}
          />
        </Grid>
        <Grid item xs={12} align="right">
          <Button
            type="button"
            color="secondary"
            variant="contained"
            onClick={props.onClose}
            size="small"
            sx={{ mx: 2 }}>
            {props.literals.cancel}
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="small">
            {props.btn}
          </Button>
        </Grid>
      </Grid>
      <Spinner
        spinner={spinner}
      />
      <SnackAlert
        msg={msg}
        alert={alert}
        severity={severity}

        closeAlert={() => setAlert(!alert)}
      />
    </Box>
  );
}
