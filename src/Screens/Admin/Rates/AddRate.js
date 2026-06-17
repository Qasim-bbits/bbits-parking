import React, { useState } from "react";
import {
  Box, FormControlLabel, Checkbox, Grid, Typography, Drawer, Button, TextField, Autocomplete, Divider, IconButton, Radio, RadioGroup, FormGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { Add, Close, DeleteForeverOutlined } from "@mui/icons-material";
import moment from "moment-timezone";

export default function AddRate(props) {

  const checkBoxes = [
    { label: 'Mo', name: 'Monday' },
    { label: 'Tu', name: 'Tuesday' },
    { label: 'We', name: 'Wednesday' },
    { label: 'Th', name: 'Thursday' },
    { label: 'Fr', name: 'Friday' },
    { label: 'Sa', name: 'Saturday' },
    { label: 'Su', name: 'Sunday' }
  ]
  return (
    <Drawer
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
      open={props.openAddDrawer}
      onClose={props.setOpenAddDrawer}
    >
      <Box
        sx={{ p: 3 }}
      >
        <form onSubmit={(e) => props.handleAddSubmit(e, props.steps)}>
          <Grid container spacing={2} sx={{ placeContent: "center" }}>
            <Grid item xs={6}>
              <Typography variant="h6" color="primary">
                {props.literals.add} {props.literals.rate}
              </Typography>
            </Grid>
            <Grid item xs={6} align="right">
              <Close
                className="drawer-icon-visiblity"
                sx={{ color: "black", cursor: "pointer" }}
                onClick={props.setAddOpenDrawer}
              />
            </Grid>
            <Grid item xs={12} align="right">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={props.zones}
                getOptionLabel={(option) => option.zone_name}
                value={props.selectedZone}
                onChange={(event, newValue) => props.onZoneSelected(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label={props.literals.select_zone} color="primary" size="small" required />
                )}
              />
            </Grid>
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel sx={{ color: "#000000de" }} control={
                  <Checkbox
                    checked={props.inputAddField["is_visitor_pass"] === true}
                    color="primary"
                    onChange={props.handleAddCheck}
                    value={props.inputAddField["is_visitor_pass"]}
                    size="small"
                    name="is_visitor_pass"
                  />} label={props.literals.is_visitor_pass} />
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel sx={{ color: "#000000de" }} control={
                  <Checkbox
                    checked={props.inputAddField["is_whitelist"] === true}
                    color="primary"
                    onChange={props.handleAddCheck}
                    value={props.inputAddField["is_whitelist"]}
                    size="small"
                    name="is_whitelist"
                  />} label={props.literals.is_whitelist} />
              </FormGroup>
            </Grid>
            <Grid item xs={4}>
              <FormGroup>
                <FormControlLabel sx={{ color: "#000000de" }} control={
                  <Checkbox
                    checked={props.inputAddField["enable_custom_rate"] === true}
                    color="primary"
                    onChange={props.handleAddCheck}
                    value={props.inputAddField["enable_custom_rate"]}
                    size="small"
                    name="enable_custom_rate"
                  />} label={props.literals?.enable_custom_rate} />
              </FormGroup>
            </Grid>
            {props.inputAddField.enable_custom_rate && <>
              <Grid item xs={6}>
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals.max_custom_rate_in_minutes}
                  color="primary"
                  type="number"
                  name="max_custom_rate_in_minutes"
                  value={props.inputAddField["max_custom_rate_in_minutes"]}
                  onChange={props.handleAddChange}
                  size="small"
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>{props.literals.custom_rate_type}</InputLabel>
                  <Select
                    name={"custom_rate_type"}
                    value={props.inputAddField["custom_rate_type"]}
                    label="custom_rate_type"
                    size="small"
                    onChange={props.handleAddChange}
                    required
                  >
                    <MenuItem value={'year'}>Yearly</MenuItem>
                    <MenuItem value={'month'}>Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>}
            <Grid item xs={12}>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
              >
                <FormControlLabel value="regular" sx={{ color: "#2c3680" }} control={
                  <Radio
                    checked={props.rateType === 'regular'}
                    onChange={props.onRateType}
                  />} label={props.literals.regular_rate} />
                <FormControlLabel value="special" sx={{ color: "#2c3680" }} control={
                  <Radio
                    checked={props.rateType === 'special'}
                    onChange={props.onRateType}
                  />} label={props.literals.special_rate} />
              </RadioGroup>
            </Grid>
            {props.rateType === 'regular' && <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.rate_name}
                color="primary"
                type="text"
                name="rate_name"
                value={props.inputAddField["rate_name"]}
                onChange={props.handleAddChange}
                size="small"
                InputProps={{ readOnly: props.btn === "Edit" }}
                required
                fullWidth
              />
            </Grid>}
            {props.rateType === 'special' && <Grid item xs={12} align="right">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                options={props.rates}
                getOptionLabel={(option) => option.rate_name}
                value={props.selectedRate}
                onChange={(event, newValue) => props.setSelectedRate(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label={props.literals.select_rate} color="primary" size="small" required />
                )}
              />
            </Grid>}

            {props.rateType === 'special' && <Grid item xs={6}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.enabled_from_utc}
                color="primary"
                type="datetime-local"
                name="start_date"
                value={props.inputAddField.start_date
                  ? moment.utc(props.inputAddField.start_date).format("YYYY-MM-DDTHH:mm") // display UTC
                  : ""}
                onChange={(e) => {
                  const value = e.target.value; // treat as UTC
                  const utcValue = moment.utc(value, "YYYY-MM-DDTHH:mm").toISOString(); // convert to ISO UTC

                  props.setInputAddField({
                    ...props.inputAddField,
                    start_date: utcValue, // store UTC
                  });
                }}
                InputLabelProps={{ shrink: true }}
                size="small"
                required
                fullWidth
              />
            </Grid>}
            {props.rateType === 'special' && <Grid item xs={6}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.enabled_to_utc}
                color="primary"
                type="datetime-local"
                name="end_date"
                value={props.inputAddField.end_date
                  ? moment.utc(props.inputAddField.end_date).format("YYYY-MM-DDTHH:mm") // display UTC
                  : ""}
                onChange={(e) => {
                  const value = e.target.value; // treat as UTC
                  const utcValue = moment.utc(value, "YYYY-MM-DDTHH:mm").toISOString(); // convert to ISO UTC

                  props.setInputAddField({
                    ...props.inputAddField,
                    end_date: utcValue, // store UTC
                  });
                }}
                size="small"
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
            </Grid>}
            {/* <Grid item xs={12}>
              <TextField
                id="standard-error-helper-text"
                label={props.literals.service_fee_in_cents}
                color="primary"
                type="number"
                name="service_fee"
                value={props.inputAddField["service_fee"]}
                onChange={props.handleAddChange}
                size="small"
                required
                fullWidth
              />
            </Grid> */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="primary">
                {props.literals.rate_steps}
              </Typography>
            </Grid>
            <Grid item xs={10} align="center">
              <Grid container spacing={2} sx={{ placeContent: "center" }}>
                {props.steps.map((el, index) => {
                  return (
                    <>
                      <Grid item xs={6} align="start" alignSelf="center">
                        <Typography variant="subtitle1" color="primary">
                          {(index + 1)}.
                        </Typography>
                      </Grid>
                      <Grid item xs={6} align="end">
                        {props.steps.length !== 1 && <IconButton
                          type="button"
                          color="primary"
                          variant="outlined"
                          onClick={() => props.delStep(index)}>
                          <DeleteForeverOutlined />
                        </IconButton>}
                      </Grid>
                      <Grid item md={6} xs={12} align="start">
                        <FormControl fullWidth>
                          <InputLabel>{props.literals.type}</InputLabel>
                          <Select
                            name={"rate_type_period-" + index}
                            value={el.rate_type_period}
                            label="rate_type_period"
                            size="small"
                            onChange={props.handleStepChange}
                          >
                            <MenuItem value={'daily'}>Daily</MenuItem>
                            <MenuItem value={'yearly'}>Yearly</MenuItem>
                            <MenuItem value={'monthly'}>Monthly</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        {el.rate_type_period && <FormGroup>
                          <FormControlLabel sx={{ color: "#000000de" }} control={
                            <Checkbox
                              id={index}
                              checked={el.end_of_year_month === true}
                              color="primary"
                              onChange={props.handleStepChange}
                              value={el.end_of_year_month}
                              size="small"
                              name="end_of_year_month"
                            />} label={el.rate_type_period == 'yearly' ? props.literals.at_end_of_year : props.literals.at_end_of_month} />
                        </FormGroup>}
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id={index}
                          label={props.literals.rate_type}
                          color="primary"
                          type="text"
                          name="rate_type_name"
                          value={el.rate_type_name}
                          onChange={props.handleStepChange}
                          size="small"
                          InputProps={{ readOnly: props.btn === "Edit" }}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id={index}
                          label={props.literals.start_time}
                          color="primary"
                          type="time"
                          name="start_time"
                          value={el.start_time}
                          onChange={props.handleStepChange}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          id={index}
                          label={props.literals.end_time}
                          color="primary"
                          type="time"
                          name="end_time"
                          value={el.end_time}
                          onChange={props.handleStepChange}
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          required
                          fullWidth
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormGroup>
                          <FormControlLabel sx={{ color: "#000000de" }} control={
                            <Checkbox
                              id={index}
                              checked={el.flat_rate === true}
                              color="primary"
                              onChange={props.handleStepChange}
                              value={el.flat_rate}
                              size="small"
                              name="flat_rate"
                            />} label={props.literals.flat_rate} />
                        </FormGroup>
                      </Grid>
                      <Grid item xs={2} alignSelf="center">
                        <Typography variant="body1" sx={{ color: '#000000de' }}>
                          {props.literals.days}:
                        </Typography>
                      </Grid>
                      <Grid item xs={10} alignSelf="center" align="right">
                        {checkBoxes.map(x => {
                          return (
                            <FormControlLabel
                              value="top"
                              sx={{ color: '#0000009c', margin: 0 }}
                              size="small"
                              control={
                                <Checkbox
                                  id={index}
                                  name={x.name}
                                  checked={el[x.name] === true}
                                  color="primary"
                                  onChange={props.handleStepChange}
                                  value={el[x.name]}
                                  size="small"
                                />}
                              label={<Typography sx={{ fontSize: '12px' }}>{x.label}</Typography>}
                              labelPlacement="top"
                            />
                          )
                        })}
                      </Grid>
                      {el.rate_steps.map((item, i) => {
                        return (
                          <>
                            <Grid item xs={5}>
                              <TextField
                                id={i}
                                label={props.literals.rate_in_cents}
                                color="primary"
                                type="number"
                                name="rate"
                                value={item.rate}
                                onChange={(e) => props.inputChange(e, index)}
                                size="small"
                                required
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={5}>
                              <TextField
                                id={i}
                                label={props.literals.time_in_minutes}
                                color="primary"
                                type="number"
                                name="time"
                                value={item.time}
                                onChange={(e) => props.inputChange(e, index)}
                                size="small"
                                required
                                fullWidth
                              />
                            </Grid>
                            <Grid item xs={1} align="center">
                              {el.rate_steps.length !== 1 && <IconButton
                                type="button"
                                color="primary"
                                variant="outlined"
                                onClick={() => props.delInput(i, index)}>
                                <DeleteForeverOutlined />
                              </IconButton>}
                            </Grid>
                            <Grid item xs={1} align="center">
                              {i === el.rate_steps.length - 1 && <IconButton
                                type="button"
                                color="primary"
                                variant="outlined"
                                onClick={() => props.addInput(i, index)}>
                                <Add />
                              </IconButton>}
                            </Grid>
                          </>
                        );
                      })}
                      <Grid item xs={12}>
                        <Divider color="primary" />
                      </Grid>
                    </>
                  )
                }
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} align="center">
              <IconButton
                type="button"
                color="primary"
                variant="outlined"
                onClick={props.addStep}>
                <Add />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="primary"
                variant="contained">
                {props.literals.add} {props.literals.rate}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Drawer>
  );
}
