import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, useTheme, RadioGroup, FormControlLabel, Radio} from "@mui/material";
import { Close } from "@mui/icons-material";

export default function AddPublicPrivateNote(props) {
  const theme = useTheme();

  return (
      <Box component="form" onSubmit={props.handleSubmit} sx={{p:3}}>
        <Grid container spacing={3} sx={{placeContent: "center"}}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
              {props.btn} {props.literals.notes}
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
                label={props.literals.note}
                color="primary"
                type="text"
                name="note"
                value={props.inputField["note"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
          </Grid>
          <Grid item xs={12}>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="public" sx={{color: "#2c3680"}} control={
                  <Radio
                    checked={props.inputField['type'] == 'public'}
                    onChange={props.onPublicPrivateNoteType}
                    required
                  />} label={props.literals.public}/>
                <FormControlLabel value="private" sx={{color: "#2c3680"}} control={
                  <Radio
                    checked={props.inputField['type'] == 'private'}
                    onChange={props.onPublicPrivateNoteType}
                    required
                  />} label={props.literals.private}/>
              </RadioGroup>
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
