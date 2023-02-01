import React, { useState } from "react";
import {
  Box, Grid, Typography, TextField, Button, IconButton, InputAdornment,
  FormControlLabel, Radio, RadioGroup, FormLabel, useTheme, Divider, FormControl, FormGroup, Switch
} from "@mui/material";
import { AddCircleOutlined, Close, Delete, Edit, EditOff, Visibility, VisibilityOff } from "@mui/icons-material";
import { config } from "../../../Constants";

export default function AddOrganization(props) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const permission = [
    {label: <Visibility sx={{color: theme.palette.primary.main}}/>, labelOff: <VisibilityOff sx={{color: theme.palette.tertiary.main}}/>, value: 'can_view'},
    {label: <AddCircleOutlined sx={{color: theme.palette.primary.main}}/>, labelOff: <AddCircleOutlined sx={{color: theme.palette.tertiary.main}}/>, value: 'can_add'},
    {label: <Edit sx={{color: theme.palette.primary.main}}/>, labelOff: <EditOff sx={{color: theme.palette.tertiary.main}}/>, value: 'can_edit'},
    {label: <Delete sx={{color: theme.palette.primary.main}}/>, labelOff: <Delete sx={{color: theme.palette.tertiary.main}}/>, value: 'can_delete'},
  ]

  return (
      <Box component="form" onSubmit={props.handleSubmit} sx={{p:3}}>
        <Grid container spacing={3} sx={{placeContent: "center"}}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
              {props.btn} {props.literals.organization}
            </Typography>
          </Grid>
          <Grid item xs={6} align='right'>
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={props.onClose}>
              <Close />
            </IconButton>
          </Grid>
          {props.btn === 'Add' && <>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="subtitle1" sx={{color: theme.palette.tertiary.main}}>
                  {props.literals.user_detail}
                </Typography>  
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.email}
                fullWidth
                type="email"
                name="email"
                value={props.inputField['email']}
                onChange={props.handleChange}
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-password-input"
                label={props.literals.password}
                fullWidth
                name="password"
                type={(showPassword) ? 'text':'password'}
                autoComplete="current-password"
                onChange={props.handleChange}
                value={props.inputField['password']}
                size="small"
                InputProps={{ 
                  // pattern: /^[a-zA-Z0-9]*$/,
                  // title: "Only numbers and alphabets are allowed",
                  endAdornment: <InputAdornment position="end">
                      <IconButton
                          onClick={()=>setShowPassword(!showPassword)}
                          edge="end"
                      >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                  </InputAdornment>
                }}
                required
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormLabel id="demo-radio-buttons-group-label">{props.literals.role}</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="role"
              >
                <FormControlLabel value="admin" sx={{color: theme.palette.primary.main}} control={
                  <Radio
                    checked={props.inputField["role"] === 'admin'}
                    onChange={props.handleChange}
                  />} label={props.literals.admin}/>
                <FormControlLabel value="root" sx={{color: theme.palette.primary.main}} control={
                  <Radio
                    checked={props.inputField["role"] === 'root'}
                    onChange={props.handleChange}
                  />} label={props.literals.root} />
              </RadioGroup>
            </Grid> */}
          </>}
          <Grid item xs={12}>
            <Divider>
              <Typography variant="subtitle1" sx={{color: theme.palette.tertiary.main}}>
                {props.literals.organization_detail}
              </Typography>  
            </Divider>
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.organization_name}
                color="primary"
                type="text"
                name="org_name"
                value={props.inputField["org_name"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.sub_domain}
                color="primary"
                helperText={
                  config.url.http +
                  ((props.inputField["sub_domain"] !== undefined && props.inputField["sub_domain"] !== '') ?
                    props.inputField["sub_domain"] + "." : '')+
                    config.url.client_url
                }
                type="text"
                name="sub_domain"
                value={props.inputField["sub_domain"]}
                onChange={props.handleChange}
                InputLabelProps={{ shrink: (props.inputField["sub_domain"] !== undefined) ? true : false }}
                size="small"
                required
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.service_fee_in_cents}
                color="primary"
                type="number"
                name="service_fee"
                value={props.inputField["service_fee"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.theme_color}
                color="primary"
                type="color"
                name="color"
                value={props.inputField["color"]}
                onChange={props.handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
                required
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <TextField
                id="standard-error-helper-text"
                label={props.literals.logo}
                color="primary"
                type="file"
                name="logo"
                onChange={(e)=>props.setLogo(e.target.files[0])} 
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
          </Grid>
          <>
            <Grid item xs={12}>
              <FormLabel id="demo-radio-buttons-group-label">{props.literals.payment_gateway}</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="payment_gateway"
              >
                <FormControlLabel value="stripe" sx={{color: theme.palette.primary.main}} control={
                  <Radio
                    checked={props.inputField["payment_gateway"] === 'stripe'}
                    onChange={props.handleChange}
                  />} label={props.literals.stripe} />
                <FormControlLabel value="moneris" sx={{color: theme.palette.primary.main}} control={
                  <Radio
                    checked={props.inputField["payment_gateway"] === 'moneris'}
                    onChange={props.handleChange}
                  />} label={props.literals.moneris} />
              </RadioGroup>
            </Grid>
            {props.inputField["payment_gateway"] === 'stripe' && <>
              <Grid item xs={12}>
                <TextField
                    id="standard-error-helper-text"
                    label={props.literals.publishable_key}
                    color="primary"
                    type="text"
                    name="stripe_publishable_key"
                    value={props.inputField["stripe_publishable_key"]}
                    onChange={props.handleChange}
                    size="small"
                    required
                    fullWidth
                  />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    id="standard-error-helper-text"
                    label={props.literals.secret_key}
                    color="primary"
                    helperText={
                    <>
                      <Typography variant="caption" display="block">
                        1. {props.literals.info_secret_key_1}
                      </Typography>
                      <Typography variant="caption" display="block">
                        2. {props.literals.info_secret_key_2_1} 
                        <a href="https://dashboard.stripe.com/login?redirect=%2Fdevelopers" target="_blank" rel="noreferrer">
                          {props.literals.info_secret_key_2_2}
                        </a>, {props.literals.info_secret_key_2_3}
                      </Typography>
                      <Typography variant="caption" display="block">
                        3. {props.literals.info_secret_key_3}
                      </Typography>
                    </>}
                    type="text"
                    name="stripe_secret_key"
                    value={props.inputField["stripe_secret_key"]}
                    onChange={props.handleChange}
                    size="small"
                    required
                    fullWidth
                  />
              </Grid>
            </>}
            {props.inputField["payment_gateway"] === 'moneris' && <>
              <Grid item xs={12}>
                <FormLabel id="demo-radio-buttons-group-label">{props.literals.payment_envoirnment}</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="payment_envoirnment"
                >
                  <FormControlLabel value="test" sx={{color: theme.palette.primary.main}} control={
                    <Radio
                      checked={props.inputField["payment_envoirnment"] === 'test'}
                      onChange={props.handleChange}
                    />} label={props.literals.test} />
                  <FormControlLabel value="live" sx={{color: theme.palette.primary.main}} control={
                    <Radio
                      checked={props.inputField["payment_envoirnment"] === 'live'}
                      onChange={props.handleChange}
                    />} label={props.literals.live} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12}>
                <TextField
                    id="standard-error-helper-text"
                    label={props.literals.store_id}
                    color="primary"
                    helperText={props.literals.store_id_helper}
                    type="text"
                    name="moneris_store_id"
                    value={props.inputField["moneris_store_id"]}
                    onChange={props.handleChange}
                    size="small"
                    required
                    fullWidth
                  />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    id="standard-error-helper-text"
                    label={props.literals.api_token}
                    color="primary"
                    helperText={props.literals.api_token_helper}
                    type="text"
                    name="moneris_api_token"
                    value={props.inputField["moneris_api_token"]}
                    onChange={props.handleChange}
                    size="small"
                    required
                    fullWidth
                  />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    id="standard-error-helper-text"
                    label={props.literals.checkout_id}
                    color="primary"
                    helperText={
                    <>
                      <Typography variant="caption" display="block">
                        {props.literals.info_get_checkout_id}
                      </Typography>
                      <Typography variant="caption" display="block">
                        1. {props.literals.info_get_checkout_id_1}
                      </Typography>
                      <Typography variant="caption" display="block">
                        &nbsp;&nbsp;{props.literals.info_get_checkout_id_test}: <a href="https://esqa.moneris.com/mpg" target="_blank" rel="noreferrer">https://esqa.moneris.com/mpg</a>&nbsp;
                        {props.literals.info_get_checkout_id_pro}: <a href="https://www3.moneris.com/mpg" target="_blank" rel="noreferrer">https://www3.moneris.com/mpg</a>
                      </Typography>
                      <Typography variant="caption" display="block">
                        2. {props.literals.info_get_checkout_id_2}
                      </Typography>
                      <Typography variant="caption" display="block">
                        3. {props.literals.info_get_checkout_id_3}
                      </Typography>
                      <Typography variant="caption" display="block">
                        4. {props.literals.info_get_checkout_id_4}
                      </Typography>
                    </>}
                    type="text"
                    name="moneris_checkout_id"
                    value={props.inputField["moneris_checkout_id"]}
                    onChange={props.handleChange}
                    size="small"
                    required
                    fullWidth
                  />
                
              </Grid>
            </>}
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
                  if(props.inputField["role"] !== 'root' && (x.key === 'module' || x.key === 'organizations')){
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
          </>
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
