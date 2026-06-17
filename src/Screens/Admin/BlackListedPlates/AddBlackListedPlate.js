import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, Chip, Stack, useTheme, FormControl, InputLabel, Select, MenuItem} from "@mui/material";
import { Close } from "@mui/icons-material";
import InputMask from 'react-input-mask';

export default function AddBlackListedPlates(props) {
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
              <TextField {...params} label={props.literals.select_organization} color="primary" size="small"  required={props.inputField["blacklist_scope"] === 'zone'}/>
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
              <TextField {...params} label={props.literals.select_zone} color="primary" size="small"  required={props.inputField["blacklist_scope"] === 'zone'}/>
              )}
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
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Blacklist Scope</InputLabel>
              <Select
                name={"blacklist_scope"}
                value={props.inputField["blacklist_scope"]}
                label="blacklist_scope"
                size="small"
                onChange={props.handleChange}
                required
              >
                <MenuItem value={'zone'}>Zone</MenuItem>
                <MenuItem value={'overAll'}>Whole System</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color={'primary'}>{'Message'}*</Typography>
            <textarea
              type="text"
              name="message"
              value={props.inputField["message"]}
              onChange={props.handleChange}
              maxlength="300"
              required
              style={{ width: '100%', height: '54px', border: '1px solid rgb(196, 196, 196)', borderRadius: '5px' }}
            ></textarea>
            <Grid align="end">
              <Typography variant="caption" sx={{ color: 'rgb(196, 196, 196)' }}>{props.inputField['message']?.length || 0}/300</Typography>
            </Grid>
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
