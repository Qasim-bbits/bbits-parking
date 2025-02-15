import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, Divider, useTheme} from "@mui/material";
import { Add, Close, DeleteForeverOutlined } from "@mui/icons-material";
import InputMask from 'react-input-mask';

export default function AddTenentPlates(props) {
  const theme = useTheme();
  console.log(props.plates)
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
          {props.selectedZone?.tenant_and_visitor && <>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.first_name}
                color="primary"
                type="text"
                name="fname"
                value={props.inputField["fname"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.last_name}
                color="primary"
                type="text"
                name="lname"
                value={props.inputField["lname"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <InputMask
                  mask="+1 (999) 999-9999"
                  maskChar=""
                  value={props.inputField['mobile_no']}
                  onChange={props.handleChange}
              >
                {() => <TextField
                  label={props.literals.phone_no}
                  color="primary"
                  name="mobile_no"
                  size="small"
                  fullWidth
                />}
              </InputMask>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.unit}
                color="primary"
                type="text"
                name="unit"
                value={props.inputField["unit"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.address}
                color="primary"
                type="text"
                name="address"
                value={props.inputField["address"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.email}
                color="primary"
                type="email"
                name="email"
                value={props.inputField["email"]}
                onChange={props.handleChange}
                size="small"
                InputProps={{
                  readOnly: props.btn == props.literals.update,
                }}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.plate_one}
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
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.car_make_one}
                color="primary"
                type="text"
                name="car_make"
                value={props.inputField["car_make"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.model_one}
                color="primary"
                type="text"
                name="model"
                value={props.inputField["model"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.color_one}
                color="primary"
                type="text"
                name="color"
                value={props.inputField["color"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>
            {props.plates == 1 && <Grid item xs={12}>
              <Button 
                type="button"
                color="primary"
                variant="contained"
                onClick={props.addPlate}
                size="small"
                sx={{mx: 2}}>
                  {props.literals.add_plate}
              </Button>
            </Grid>}
            {props.plates >= 2 && <>
              <Grid item xs={12}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.plate_two}
                  color="primary"
                  type="text"
                  name="plate_two"
                  value={props.inputField["plate_two"]}
                  onChange={props.handleChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.car_make_two}
                  color="primary"
                  type="text"
                  name="car_make_two"
                  value={props.inputField["car_make_two"]}
                  onChange={props.handleChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.model_two}
                  color="primary"
                  type="text"
                  name="model_two"
                  value={props.inputField["model_two"]}
                  onChange={props.handleChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.color_two}
                  color="primary"
                  type="text"
                  name="color_two"
                  value={props.inputField["color_two"]}
                  onChange={props.handleChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              {props.plates == 2 && <Grid item xs={12}>
                <Button 
                  type="button"
                  color="primary"
                  variant="contained"
                  onClick={props.addPlate}
                  size="small"
                  sx={{mx: 2}}>
                    {props.literals.add_plate}
                </Button>
                <Button 
                  type="button"
                  color="secondary"
                  variant="contained"
                  onClick={props.delPlate}
                  size="small"
                  sx={{mx: 2}}>
                    Delete
                </Button>
              </Grid>}
            </>}
            {props.plates >= 3 && <>
              <Grid item xs={12}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.plate_three}
                  color="primary"
                  type="text"
                  name="plate_three"
                  value={props.inputField["plate_three"]}
                  onChange={props.handleChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.car_make_three}
                  color="primary"
                  type="text"
                  name="car_make_three"
                  value={props.inputField["car_make_three"]}
                  onChange={props.handleChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.model_three}
                  color="primary"
                  type="text"
                  name="model_three"
                  value={props.inputField["model_three"]}
                  onChange={props.handleChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.color_three}
                  color="primary"
                  type="text"
                  name="color_three"
                  value={props.inputField["color_three"]}
                  onChange={props.handleChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button 
                  type="button"
                  color="secondary"
                  variant="contained"
                  onClick={props.delPlate}
                  size="small"
                  sx={{mx: 2}}>
                    Delete
                </Button>
              </Grid>
            </>}
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.no_of_visitors}
                color="primary"
                type="number"
                name="no_of_visitors"
                value={props.inputField["no_of_visitors"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>
          </>}
          {!props.selectedZone?.tenant_and_visitor && <Grid item xs={12}>
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
          </Grid>}
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
