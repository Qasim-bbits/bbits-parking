import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete } from "@mui/material";
import Map from "../../../components/Map";
import { Close } from "@mui/icons-material";
import moment from 'moment-timezone';

export default function AddCity(props) {

  return (
      <Box component="form" onSubmit={props.handleSubmit} sx={{p:3}}>
        <Grid container spacing={3} sx={{placeContent: "center"}}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
              {props.btn} {props.literals.city}
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
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.city_name}
                color="primary"
                type="text"
                name="city_name"
                value={props.inputField["city_name"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
          </Grid>
          <Grid item xs={12} align="right">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={moment.tz.names()}
              getOptionLabel={(option) => option}
              value={props.selectedTimeZone}
              onChange={(event, newValue)=>props.setSelectedTimeZone(newValue)}
              renderInput={(params) => (
              <TextField {...params} label={props.literals.time_zone} color="primary" size="small" required/>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Map
              center={props.center}
              zoom={props.zoom}
              polygon={props.polygon}
              height={'80vh'}
              editable={true}
              literals={props.literals}

              setPolygon={(e)=>props.setPolygon(e)}
              setCenter={(e)=>props.setCenter(e)}
              setZoom={(e)=>props.setZoom(e)}
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
