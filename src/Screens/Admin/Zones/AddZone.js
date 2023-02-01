import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import Map from "../../../components/Map";
import { Close } from "@mui/icons-material";

export default function AddZone(props) {

  return (
      <Box component="form" onSubmit={props.handleSubmit} sx={{p:3}}>
        <Grid container spacing={3} sx={{placeContent: "center"}}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
              {props.btn} {props.literals.zone}
            </Typography>
          </Grid>
          <Grid item xs={6} align='right'>
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={props.onClose}>
              <Close />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              freeSolo
              id="free-solo-2-demo"
              disableClearable
              blurOnSelect
              options={props.cities}
              getOptionLabel={(option) => option.city_name}
              value={props.selectedCity}
              onChange={(event, newValue)=>props.setSelectedCity(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  // sx={{width: smDown ? 200 : 300, backgroundColor: '#fff'}}
                  label={props.literals.select_city}
                  variant='outlined'
                  size='small'
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.zone_name}
                color="primary"
                type="text"
                name="zone_name"
                value={props.inputField["zone_name"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <FormGroup>
              <FormControlLabel control={
                <Checkbox 
                  name="tenant_zone"
                  onChange={props.handleCheck}
                />} label={
                  <Typography variant="subtitle1" color="primary" className="font-gray">
                    {props.literals.tenant_zone}
                  </Typography>
                }/>
            </FormGroup>
          </Grid>
          <Grid item xs={12}>
            <Map
              center={props.center}
              zoom={props.zoom}
              polygon={props.polygon}
              height={'80vh'}
              editable={true}
              literals = {props.literals}

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
