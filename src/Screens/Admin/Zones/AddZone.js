import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import Map from "../../../components/Map";
import { Close } from "@mui/icons-material";

export default function AddZone(props) {

  return (
    <Box component="form" onSubmit={props.handleSubmit} sx={{ p: 3 }}>
      <Grid container spacing={3} sx={{ placeContent: "center" }}>
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
            getOptionLabel={(option) => option.city_name + ' - ' + option.org?.org_name}
            value={props.selectedCity}
            onChange={(event, newValue) => props.setSelectedCity(newValue)}
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
        <Grid item xs={4}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                name="tenant_zone"
                onChange={props.handleCheck}
                checked={props.inputField['tenant_zone']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.tenant_zone}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        <Grid item xs={4}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                name="tenant_and_visitor"
                onChange={props.handleCheck}
                checked={props.inputField['tenant_and_visitor']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.allow_visitor}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        <Grid item xs={4}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                name="add_caption"
                onChange={props.handleCheck}
                checked={props.inputField['add_caption']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.add_caption}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                name="can_user_kick_out"
                onChange={props.handleCheck}
                checked={props.inputField['can_user_kick_out']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.can_user_kick_out}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        {props.inputField['add_caption'] && <>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color={'primary'}>{props.literals.caption_en}*</Typography>
            <textarea
              type="text"
              name="caption_en"
              value={props.inputField["caption_en"]}
              onChange={props.handleChange}
              maxlength="100"
              required
              style={{ width: '100%', height: '54px', border: '1px solid rgb(196, 196, 196)', borderRadius: '5px' }}
            ></textarea>
            <Grid align="end">
              <Typography variant="caption" sx={{ color: 'rgb(196, 196, 196)' }}>{props.inputField['caption_en']?.length || 0}/100</Typography>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color={'primary'}>{props.literals.caption_fr}*</Typography>
            <textarea
              type="text"
              name="caption_fr"
              value={props.inputField["caption_fr"]}
              onChange={props.handleChange}
              maxlength="100"
              required
              style={{ width: '100%', height: '54px', border: '1px solid rgb(196, 196, 196)', borderRadius: '5px' }}
            ></textarea>
            <Grid align="end">
              <Typography variant="caption" sx={{ color: 'rgb(196, 196, 196)' }}>{props.inputField['caption_fr']?.length || 0}/100</Typography>
            </Grid>
          </Grid>
        </>}
        <Grid item xs={4}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                name="enable_parking_limit"
                onChange={props.handleCheck}
                checked={props.inputField['enable_parking_limit']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.enable_parking_limit}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        <Grid item xs={8}>
          {props.inputField.enable_parking_limit && <TextField
            label={props.literals.no_of_parking_per_plate}
            color="primary"
            type="number"
            name="no_of_parking_per_plate"
            value={props.inputField["no_of_parking_per_plate"]}
            onChange={props.handleChange}
            size="small"
            required
            fullWidth
          />}
        </Grid>
        <Grid item xs={4}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                name="is_business_pass"
                onChange={props.handleCheck}
                checked={props.inputField['is_business_pass']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.is_business_pass}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        <Grid item xs={8}>
          {props.inputField.is_business_pass && <TextField
            label={props.literals.no_of_business_pass}
            color="primary"
            type="number"
            name="no_of_business_pass"
            value={props.inputField["no_of_business_pass"]}
            onChange={props.handleChange}
            size="small"
            required
            fullWidth
          />}
        </Grid>
        <Grid item xs={12}>
          <Map
            center={props.center}
            zoom={props.zoom}
            polygon={props.polygon}
            height={'80vh'}
            editable={true}
            literals={props.literals}

            setPolygon={(e) => props.setPolygon(e)}
            setCenter={(e) => props.setCenter(e)}
            setZoom={(e) => props.setZoom(e)}
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
    </Box>
  );
}
