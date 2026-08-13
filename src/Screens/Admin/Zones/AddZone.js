import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, FormGroup, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Map from "../../../components/Map";
import { Close } from "@mui/icons-material";
import InputMask from "react-input-mask";
import { constants } from "../../../constants/app.constants";

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
        <Grid item xs={12}>
          <TextField
            id="standard-error-helper-text"
            label={props.literals.zone_code}
            color="primary"
            name="zone_code"
            value={props.inputField["zone_code"]}
            onChange={(e) => {
              if (e.target.value !== "" && !constants.regexPatterns.alphaNumeric.test(e.target.value) ) {
                return;
              }
              props.handleChange(e);
            }}
            size="small"
            required
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-error-helper-text"
            label={props.literals.owner_email}
            color="primary"
            type="email"
            name="owner_email"
            value={props.inputField["owner_email"]}
            onChange={props.handleChange}
            size="small"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="standard-error-helper-text"
            label={props.literals.redirect_to}
            color="primary"
            type="text"
            name="redirect_to"
            value={props.inputField["redirect_to"]}
            onChange={props.handleChange}
            size="small"
            fullWidth
          />
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
                name="enable_extension"
                onChange={props.handleCheck}
                checked={props.inputField['enable_extension']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.enable_extension}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        <Grid item xs={8}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                name="parking_registration_ui"
                onChange={props.handleCheck}
                checked={props.inputField['parking_registration_ui']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.parking_registration_ui}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        <Grid item xs={4}>
          <FormGroup>
            <FormControlLabel control={
              <Checkbox
                name="is_plate_editable"
                onChange={props.handleCheck}
                checked={props.inputField['is_plate_editable']}
              />} label={
                <Typography variant="subtitle1" color="primary" className="font-gray">
                  {props.literals.is_plate_editable}
                </Typography>
              } />
          </FormGroup>
        </Grid>
        <Grid item xs={8}>
          {props.inputField.is_plate_editable && <TextField
            label={props.literals.no_of_times_plate_can_edit}
            color="primary"
            type="number"
            name="no_of_times_plate_can_edit"
            value={props.inputField["no_of_times_plate_can_edit"]}
            onChange={props.handleChange}
            size="small"
            required
            fullWidth
          />}
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
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
            {props.inputField.enable_parking_limit && <Grid item xs={8}>
              <TextField
                label={props.literals.no_of_parking_per_plate}
                color="primary"
                type="number"
                name="no_of_parking_per_plate"
                value={props.inputField["no_of_parking_per_plate"]}
                onChange={props.handleChange}
                size="small"
                required
                fullWidth
              />
            </Grid>}
            {props.inputField.enable_parking_limit && <Grid item md={4} sm={12}>
              <FormControl fullWidth>
                <InputLabel>{props.literals.parking_limit_type}</InputLabel>
                <Select
                  name={"parking_limit_type"}
                  value={props.inputField["parking_limit_type"]}
                  label="parking_limit_type"
                  size="small"
                  onChange={props.handleChange}
                  required
                >
                  <MenuItem value={'yearly'}>Yearly</MenuItem>
                  <MenuItem value={'monthly'}>Monthly</MenuItem>
                  <MenuItem value={'custom'}>Custom</MenuItem>
                </Select>
              </FormControl>
            </Grid>}
            {props.inputField.enable_parking_limit && props.inputField.parking_limit_type == 'custom' && <Grid item md={4} sm={12}>
              <TextField
                label={props.literals.start_parking_limit_date}
                color="primary"
                type="date"
                name="start_parking_limit_date"
                value={props.inputField["start_parking_limit_date"]}
                onChange={props.handleChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                required
                fullWidth/>
            </Grid>}
            {props.inputField.enable_parking_limit && props.inputField.parking_limit_type == 'custom' && <Grid item md={4} sm={12}>
              <TextField
                label={props.literals.end_parking_limit_date}
                color="primary"
                type="date"
                name="end_parking_limit_date"
                value={props.inputField["end_parking_limit_date"]}
                onChange={props.handleChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                required
                fullWidth/>
            </Grid>}
          </Grid>
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
