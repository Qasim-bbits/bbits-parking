import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, FormGroup, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DirectionsCar } from "@mui/icons-material";
import Map from "../../../../components/Map";
import { Close } from "@mui/icons-material";
import InputMask from "react-input-mask";
import { constants } from "../../../../constants/app.constants";

export default function RegistrationUI(props) {
  const [inputField, setInputField] = useState({});

  const handleChange = (e) => {
    setInputField({ ...inputField, [e.target.name]: e.target.name == 'plate' ? e.target.value.toUpperCase() : e.target.value });
  };

  return (
    <Box component="form" onSubmit={(e) => {
      e.preventDefault();
      props.registerVehicle(inputField);
    }} sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{
        width: {
          xs: "100%",
          sm: "100%",
          md: "70%",
        },
        mx: "auto",
      }}>
        <Grid item xs={12} sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <DirectionsCar />
          <Typography variant="h6" className="font-bold">
            {props.literals.register_vehicle}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {props.literals.registration_disclaimer}
            </Typography>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-error-helper-text"
            label={props.literals.full_name}
            color="primary"
            type="text"
            name="full_name"
            value={inputField["full_name"]}
            onChange={handleChange}
            size="small"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-error-helper-text"
            label={props.literals.license_plate}
            type="text"
            color='primary'
            size="small"
            name="plate"
            value={inputField["plate"]}
            onChange={(e) => {
              if (e.target.value !== "" && !constants.regexPatterns.alphaNumeric.test(e.target.value)) {
                return;
              }
              handleChange(e);
            }}
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} >
          <TextField
            id="standard-error-helper-text"
            label={props.literals.email}
            color="primary"
            type="email"
            name="email"
            value={inputField["email"]}
            onChange={handleChange}
            size="small"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12} >
          <InputMask
            mask="+1 (999) 999-9999"
            maskChar=""
            value={inputField['mobile_no']}
            onChange={handleChange}
          >
            <TextField
              label={props.literals.phone_no}
              color="primary"
              name="mobile_no"
              size="small"
              required
              fullWidth
            />
          </InputMask>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="nights"
            label="How many nights you want to stay?"
            color="primary"
            name="nights"
            value={inputField["nights"]}
            onChange={handleChange}
            size="small"
            required
            fullWidth
            select
          >
            {[...Array(10)].map((_, index) => (
              <MenuItem key={index + 1} value={index + 1}>
                {index + 1}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            size="medium"
            fullWidth>
            {props.literals.register_vehicle}
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="font-bold">
            {props.literals.privacy_notice}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {props.literals.privacy_policy_registration}
            </Typography>
        </Grid>
        <Grid item xs={12} sx={{ display: "flex", gap: "5px", alignItems: "center" }}>
          <Typography variant="subtitle1">
            {props.literals.privacy_questions}
            </Typography>
            <Typography variant="subtitle1" className="font-bold">
              {props.zone.owner_email}
            </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            {props.literals.consent_confirmation}
            </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}