import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, Divider, useTheme} from "@mui/material";
import { Add, Close, DeleteForeverOutlined } from "@mui/icons-material";
import InputMask from 'react-input-mask';

export default function AddBusinessPassPlates(props) {
  const theme = useTheme();
  
  return (
      <Box component="form" onSubmit={props.handleSubmit} sx={{p:3}}>
        <Grid container spacing={3} sx={{placeContent: "center"}}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
              {props.btn} {props.literals.plate}
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
              onChange={(event, newValue)=>props.setSelectedOrg(newValue)}
              renderInput={(params) => (
              <TextField {...params} label={props.literals.select_organization} color="primary" size="small" required/>
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
              onChange={(event, newValue)=>props.setSelectedZone(newValue)}
              renderInput={(params) => (
              <TextField {...params} label={props.literals.select_zone} color="primary" size="small" required/>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.name}
                color="primary"
                type="text"
                name="name"
                value={props.inputField["name"]}
                onChange={props.handleChange}
                size="small"
                required
                inputProps={{ maxLength: 20 }}
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.notes}
                color="primary"
                type="text"
                name="notes"
                value={props.inputField["notes"]}
                onChange={props.handleChange}
                size="small"
                required
                inputProps={{ maxLength: 80 }}
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.plate}
                color="primary"
                type="text"
                name="plate"
                value={props.inputField["plate"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
          </Grid>
          <Grid item xs={12} align="right">
            <Button 
              type="button"
              color="secondary"
              variant="contained"
              onClick={props.onClose}
              size="small"
              sx={{mx: 2}}>
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
    </Box>
  );
}
