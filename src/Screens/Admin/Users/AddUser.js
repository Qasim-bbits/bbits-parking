import * as React from "react";
import {
  Box, Radio, RadioGroup, FormControlLabel, FormControl,
  FormLabel, Drawer, Button, TextField, useTheme, Grid, Typography, IconButton, Autocomplete, Divider
} from "@mui/material";
import { AddCircleOutlined, Close, Delete, Edit, EditOff, Visibility, VisibilityOff } from "@mui/icons-material";
import InputMask from 'react-input-mask';

export default function AddUser(props) {
  const theme = useTheme();
  const permission = [
    {label: <Visibility sx={{color: theme.palette.primary.main}}/>, labelOff: <VisibilityOff sx={{color: theme.palette.tertiary.main}}/>, value: 'can_view'},
    {label: <AddCircleOutlined sx={{color: theme.palette.primary.main}}/>, labelOff: <AddCircleOutlined sx={{color: theme.palette.tertiary.main}}/>, value: 'can_add'},
    {label: <Edit sx={{color: theme.palette.primary.main}}/>, labelOff: <EditOff sx={{color: theme.palette.tertiary.main}}/>, value: 'can_edit'},
    {label: <Delete sx={{color: theme.palette.primary.main}}/>, labelOff: <Delete sx={{color: theme.palette.tertiary.main}}/>, value: 'can_delete'},
  ]
  
  return (
    <Drawer
      className="drawer-width"
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
      open={props.openDrawer}
      onClose={props.setOpenDrawer}
    >
      <Box component="form" onSubmit={props.handleSubmit} sx={{p:3}}>
        <Grid container spacing={3} sx={{placeContent: "center"}}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
              {props.btn} {props.literals.user}
            </Typography>
          </Grid>
          <Grid item xs={6} align="right">
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={props.setOpenDrawer}>
              <Close />
            </IconButton>
          </Grid>
          <Grid item xs={12} >
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={props.organizations}
              getOptionLabel={(option) => option.org_name}
              value={props.selectedOrg}
              readOnly={(props.user?.result?.role !== 'root') ? true : false}
              onChange={(event, newValue)=>props.setSelectedOrg(newValue)}
              renderInput={(params) => (
              <TextField 
                {...params} label={props.literals.select_organization}
                color="primary" size="small" 
                required/>
              )}
            />
          </Grid>
          <Grid item xs={12} >
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
          <Grid item xs={12} >
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
          <Grid item xs={12} >
            <TextField
              id="standard-error-helper-text"
              label={props.literals.address}
              color="primary"
              type="text"
              name="address"
              value={props.inputField["address"]}
              onChange={props.handleChange}
              size="small"
              // required
              fullWidth
            />
          </Grid>
          <Grid item xs={12} >
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
          <Grid item xs={12} >
            <TextField
              id="standard-error-helper-text"
              label={props.literals.email}
              color="primary"
              type="email"
              name="email"
              value={props.inputField["email"]}
              onChange={props.handleChange}
              size="small"
              disabled={props.btn == props.literals.update}
              required
              fullWidth
            />
          </Grid>
          {props.btn === props.literals.add && <Grid item xs={12} >
            <FormControl  color="primary">
              <FormLabel color="primary" id="demo-row-radio-buttons-group-label">{props.literals.role}</FormLabel>
              <RadioGroup
                row
                name="role"
                value={props.inputField["role"]}
                onChange={props.handleChange}
                color="primary"
              >
                <FormControlLabel value="user" sx={{color: theme.palette.primary.main}} control={
                  <Radio color="primary"/>
                } label={props.literals.user}/>
                <FormControlLabel value="admin" sx={{color: theme.palette.primary.main}} control={
                  <Radio color="primary"/>
                } label={props.literals.admin} />
                <FormControlLabel value="agent" sx={{color: theme.palette.primary.main}} control={
                  <Radio color="primary"/>
                } label={props.literals.agent} />
              </RadioGroup>
            </FormControl>
          </Grid>}
          {props.btn === props.literals.add && props.inputField["role"] == 'admin' && <>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="subtitle1" sx={{color: theme.palette.tertiary.main}}>
                  {props.literals.permissions}
                </Typography>  
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3} sx={{alignItems: "center"}}>
                {props.modules.map(x=>{
                  if(props.inputField["role"] !== 'root' && (x.module_name === 'Manage Modules' || x.module_name === 'Manage Organizations')){
                    return;
                  }
                  return(
                    <>
                      <Grid item xs={5}>
                        <Typography variant="subtitle1" sx={{color: theme.palette.tertiary.main}}>
                          {x.module_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={7} align="center">
                        {permission.map(y=>{
                          return(
                            <IconButton
                              onClick={()=>props.handleSwitch(y.value, x._id)}
                            >
                              {(x[y.value] == true) ? y.label : y.labelOff}
                            </IconButton>
                          )
                        })}
                      </Grid>
                    </>
                  )
                })}
              </Grid>
            </Grid>
          </>}
          {props.inputField["role"] == 'agent' && <>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="subtitle1" sx={{color: theme.palette.tertiary.main}}>
                  {props.literals.permissions}
                </Typography>  
              </Divider>
            </Grid>
            <Grid item xs={12} >
              <Autocomplete
                multiple
                options={props.cities}
                getOptionLabel={(option) => option.city_name + ' - ' + option.org?.org_name}
                value={props.selectedCities}
                onChange={(event, newValue)=>props.setSelectedCities(newValue)}
                renderInput={(params) => (
                <TextField 
                  {...params} label={props.literals.select_city}
                  color="primary" size="small"/>
                )}
              />
            </Grid>
          </>}
          <Grid item xs={12} align="right">
            <Button 
              type="button"
              color="secondary"
              variant="contained"
              onClick={props.setOpenDrawer}
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
    </Drawer>
  );
}
