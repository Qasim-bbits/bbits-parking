import React from "react";
import { Box, Grid, Typography, TextField, Button, IconButton, Autocomplete, FormLabel, RadioGroup, FormControlLabel, Radio, useTheme} from "@mui/material";
import { Add, Close, DeleteForeverOutlined, FilterAltOutlined } from "@mui/icons-material";

export default function Filter(props) {
  const theme = useTheme();

  return (
      <Box component="form" onSubmit={props.generateReport} sx={{p:3}}>
        <Grid container spacing={3} sx={{placeContent: "center"}}>
          <Grid item xs={6}>
            <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
              <FilterAltOutlined/> {props.literals.filter}
            </Typography>
          </Grid>
          <Grid item xs={6} align='right'>
            <IconButton color="primary" aria-label="upload picture" component="label" onClick={props.onClose}>
              <Close />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
          <Grid container spacing={2} sx={{placeContent: "center"}}>
                <Grid item xs={12}>
                  <FormLabel id="demo-radio-buttons-group-label">Filter by</FormLabel>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="filter_by"
                  >
                    <FormControlLabel value="parking" sx={{color: theme.palette.primary.main}} control={
                      <Radio
                        checked={props.filterBy === 'parking'}
                        onChange={props.setFilterBy}
                      />} label={"Parking"} />
                    <FormControlLabel value="ticket_issued" sx={{color: theme.palette.primary.main}} control={
                      <Radio
                        checked={props.filterBy === 'ticket_issued'}
                        onChange={props.setFilterBy}
                      />} label={"Ticket Issued"} />
                  </RadioGroup>
                </Grid>
                {props.inputs.map((el, index) => {
                    return (
                      <>
                        <Grid item xs={3}>
                          <Autocomplete
                            disablePortal
                            options={props.keys}
                            getOptionLabel={(option) => option.name}
                            value={el.key}
                            // readOnly={(props.user?.result?.role !== 'root') ? true : false}
                            onChange={(event, newValue)=>props.onKeySelect(newValue, index)}
                            renderInput={(params) => (
                            <TextField {...params} label={props.literals.select_key} color="primary" size="small" required/>
                            )}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Autocomplete
                            disablePortal
                            options={props.operator[
                              (el.key?.key === 'from' && el.key?.name === 'Start Date') ? 'dateOperator'
                              : (el.key?.key === 'from' && el.key?.name === 'Start Time') ? 'timeOperator'
                              : (el.key?.key === 'to' && el.key?.name === 'End Date') ? 'dateOperator'
                              : (el.key?.key === 'to' && el.key?.name === 'End Time') ? 'timeOperator'
                              : (el.key?.key === 'issued_at') ? 'dateOperator'
                              : (el.key?.key === 'paid_at') ? 'dateOperator'
                              : (el.key?.key === 'parking_id') ? 'dateOperator'
                              : (el.key?.key === 'amount') ? 'dateOperator' 
                              : (el.key?.key === 'city') ? 'objectIDOperator' 
                              : (el.key?.key === 'zone') ? 'objectIDOperator' 
                              : (el.key?.key === 'user') ? 'objectIDOperator' 
                              : (el.key?.key === 'issued_by') ? 'objectIDOperator'
                              : (el.key?.key === 'org') ? 'objectIDOperator'
                              : (el.key?.key === 'ticket_status') ? 'objectIDOperator' : 'commonOperator']}
                              getOptionLabel={(option) => option.name}
                            value={el.operator}
                            // readOnly={(props.user?.result?.role !== 'root') ? true : false}
                            onChange={(event, newValue)=>props.onOperatorSelect(newValue, index)}
                            renderInput={(params) => (
                            <TextField {...params} label={props.literals.operator} color="primary" size="small" required/>
                            )}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          {(el.key?.key === 'org' || el.key?.key === 'city'
                          || el.key?.key === 'zone' || el.key?.key === 'user' || el.key?.key === 'issued_by') &&
                            <Autocomplete
                              disablePortal
                              options={props.value[el.key.key]}
                              getOptionLabel={(option) => option[(el.key.key=='user' || el.key.key=='issued_by')? 'email' : el.key.key+'_name']}
                              value={el.value}
                              // readOnly={(props.user?.result?.role !== 'root') ? true : false}
                              onChange={(event, newValue)=>props.onValueSelect(newValue, index)}
                              renderInput={(params) => (
                              <TextField {...params} label={props.literals['select_'+el.key.key]} color="primary" size="small" required/>
                              )}
                            />}
                            {(el.key?.key === 'ticket_status') &&
                              <Autocomplete
                                disablePortal
                                options={props.value[el.key.key]}
                                getOptionLabel={(option) => option}
                                value={el.value}
                                // readOnly={(props.user?.result?.role !== 'root') ? true : false}
                                onChange={(event, newValue)=>props.onValueSelect(newValue, index)}
                                renderInput={(params) => (
                                <TextField {...params} label={el.key.name} color="primary" size="small" required/>
                                )}
                            />}
                          {(el.key?.key == 'plate' || el.key?.key == 'amount' 
                            || el.key?.key == 'parking_id' || el.key?.key == 'service_fee'
                            || el.key?.key == 'ticket_num') &&
                            <TextField
                              id={index}
                              label={el.key?.name}
                              color="primary"
                              type="text"
                              name="value"
                              value={el.value}
                              onChange={props.handleInputChange}
                              size="small"
                              InputLabelProps={{ shrink: true }}
                              required
                              fullWidth
                            />
                          }
                          {(
                            (el.key?.key === 'from' && el.key?.name === 'Start Date') ||
                            (el.key?.key === 'to' && el.key?.name === 'End Date') ||
                            el.key?.key === 'issued_at' ||
                            el.key?.key === 'paid_at') &&
                              <TextField
                                id={index}
                                label={el.key?.name}
                                color="primary"
                                type="date"
                                name="value"
                                value={el.value}
                                onChange={props.handleInputChange}
                                size="small"
                                InputLabelProps={{ shrink: true }}
                                required
                                fullWidth
                              />
                          }
                          {(
                            (el.key?.key === 'from' && el.key?.name === 'Start Time') ||
                            (el.key?.key === 'to' && el.key?.name === 'End Time')) &&
                            <Grid container spacing={2} sx={{placeContent: "center"}}>
                              <Grid item xs={6}>
                                <TextField
                                  id={index}
                                  label={el.key?.name}
                                  color="primary"
                                  type="time"
                                  name="value"
                                  value={el.value}
                                  onChange={props.handleInputChange}
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  required
                                  fullWidth
                                />
                              </Grid>
                              <Grid item xs={6}>
                                <TextField
                                  id={index}
                                  label={el.key?.name}
                                  color="primary"
                                  type="time"
                                  name="value2"
                                  value={el.value2}
                                  min="09:00"
                                  onChange={props.handleInputChange}
                                  size="small"
                                  InputLabelProps={{ shrink: true }}
                                  required
                                  fullWidth
                                />
                              </Grid>
                            </Grid>
                          }
                        </Grid>
                        <Grid item xs={1} align="center">
                          <Button
                            type="button"
                            color="primary"
                            variant={el.condition == "AND" ? "contained":"outlined"}
                            onClick={()=>props.addInput('AND', index)}>
                              {props.literals.and}
                          </Button>
                        </Grid>
                        <Grid item xs={1} align="center">
                          <Button
                            type="button"
                            color="primary"
                            variant={el.condition == "OR" ? "contained":"outlined"}
                            onClick={()=>props.addInput('OR', index)}>
                              {props.literals.or}
                          </Button>
                        </Grid>
                        <Grid item xs={1} align="end">
                          {props.inputs.length !== 1 && <IconButton
                            type="button"
                            color="primary"
                            variant="outlined"
                            onClick={()=>props.delInput(index)}>
                              <DeleteForeverOutlined/>
                          </IconButton>}
                        </Grid>
                      </>
                  )}
                )}
              </Grid>
              {props.filterBy === 'parking' && <Grid item sm={12} md={4} className="mt-3">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={props.groupBy}
                  getOptionLabel={(option) => option}
                  value={props.selectedGroup}
                  onChange={(event, newValue) => props.setSelectedGroup(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label={props.literals.group_by} color="primary" size="small" />
                  )}
                />
              </Grid>}
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
                {props.apply} Apply
            </Button>
          </Grid>
        </Grid>
    </Box>
  );
}
