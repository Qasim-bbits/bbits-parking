import React, { useState, useEffect } from "react";
import { Typography, Box, Grid, Button, TextField, IconButton, Modal } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import CustomTable from "../../../shared/CustomTable";
import organizationServices from "../../../services/organization-service";
import cityServices from "../../../services/city-service";
import { useTheme } from "@mui/styles";
import { constants } from "../../../constants/app.constants";
import { Close } from "@mui/icons-material";
const moment = require('moment-timezone');

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ParkingsView(props) {
  moment.tz.setDefault(moment.tz.guess());
  const theme = useTheme();
  const user = JSON.parse(sessionStorage.getItem('userLogged'));
  const [organizations, setOrganizations] = useState([]);
  const [cities, setCities] = useState([]);
  const [zones, setZones] = useState([]);

  const columns = [
    { field: 'parking_id', headerName: 'Parking ID', type: 'number', minWidth: 150, filterable: true },
    { field: 'org', headerName: 'Organization', valueFormatter: (params) => params?.value?.org_name, minWidth: 150, type: "singleSelect",
      valueOptions: organizations, filterable: true },
    { field: 'zone', headerName: 'Zone', valueFormatter: (params) => params?.value?.zone_name, minWidth: 200, type: "singleSelect",
      valueOptions: zones, filterable: true },
    { field: 'city', headerName: 'City', valueFormatter: (params) => params.value?.city_name, minWidth: 150, type: "singleSelect",
      valueOptions: cities, filterable: true },
    // { field: 'fname', headerName: 'User Name', valueGetter: (params) => params.row?.user?.fname, width: 150, headerClassName: 'header' },
    { field: 'email', headerName: 'User Email', valueGetter: (params) => params.row?.user?.email || params.row?.email, minWidth: 200, filterable: false },
    { field: 'plate', headerName: 'Plate', minWidth: 150, filterable: true},
    { field: 'plate_two', headerName: 'Plate Two', minWidth: 150, filterable: true},
    { field: 'plate_three', headerName: 'Plate Three', minWidth: 150, filterable: true},
    { field: 'amount', headerName: 'Amount', valueGetter: (params) => '$ '+(params.row?.amount/100).toFixed(2), minWidth: 150, filterable: true},
    { field: 'transaction_date', headerName: 'Transaction Date', type: 'date', valueGetter: (params) => params.row.transaction_date ? moment(params.row.transaction_date).tz(params.row?.city?.time_zone ? params.row?.city?.time_zone : 'America/New_York' ).format('ll hh:mm a') : '--', minWidth: 200, filterable: true},
    { field: 'from', headerName: 'Start Date/Time', type: 'date', valueGetter: (params) => moment(params.row.from).tz(params.row?.city?.time_zone ? params.row?.city?.time_zone : 'America/New_York' ).format('ll hh:mm a'), minWidth: 200, filterable: true},
    { field: 'to', headerName: 'End Date/Time', type: 'date', valueGetter: (params) => moment(params.row.to).tz(params.row?.city?.time_zone ? params.row?.city?.time_zone : 'America/New_York' ).format('ll hh:mm a'), minWidth: 200, filterable: true},
    {
      field: 'actions', 
      headerName: props.literals.action,
      minWidth: 200,
      renderCell: (params) => (
        <>
          {params.row.org?.enable_parking_limit &&
            <Button 
              variant="outlined"
              color="primary"
              size="small"
              onClick={()=>props.onResetParking(params.row)}
            >
              {props.literals.reset_parking_limit}
            </Button>
          }
          {params.row.zone?.is_business_pass && (moment() < moment(params.row.to)) &&
            <Button 
              variant="outlined"
              color="primary"
              size="small"
              onClick={()=>props.endSession(params.row)}
            >
              {props.literals.end_session}
            </Button>
          }
          {params.row.zone?.can_user_kick_oaut && (moment() <= moment(params.row.to)) &&
            <Button 
              variant="outlined"
              color="primary"
              size="small"
              onClick={()=>props.conFirmKickOutPlate(params.row)}
            >
              {props.literals.kick_out}
            </Button>
          }
          {params.row.zone?.no_of_times_plate_can_edit > params.row.no_of_times_plate_edited && (moment() <= moment(params.row.to)) &&
            <Button 
              variant="outlined"
              color="primary"
              size="small"
              onClick={()=>props.openEditPlateModal(params.row)}
            >
              {props.literals.edit_plate}
            </Button>
          }
        </>
      )
    },
  ]
  
    useEffect(() => {
      getOrganizations();
      getCities();
      getZones();
    }, [])
  
    const getOrganizations = async () => {
      props.setSpinner(true);
      const res = await organizationServices.getOrganizations();
      let org;
      if (user.result?.role !== 'root') {
        org = res.data.find(x => x._id == props.org_id);
      } else {
        org = res.data;
      }
      setOrganizations(org.map(x => ({ value: x._id, label: x.org_name })));
      props.setSpinner(false);
    }
  
    const getCities = async () => {
      props.setSpinner(true);
      const res = await cityServices.getCities({ org_id: props.org_id });
      setCities(res.data.map(x => ({ value: x._id, label: x.city_name })))
      props.setSpinner(false);
    }
  
    const getZones = async () => {
      props.setSpinner(true);
      const res = await cityServices.getZones({ org_id: props.org_id });
      setZones(res.data.map(x => ({ value: x._id, label: x.zone_name })))
      props.setSpinner(false);
    }

  return (
    <Grid container spacing={3} sx={{placeContent: "center"}}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" color="primary">{props.literals.parkings}</Typography>
      </Grid>
      <Grid item xs={12}>
        <CustomTable
          columns={columns}
          data={props.parking}

          onPageChange={props.onPageChange}
          onFilter={props.onFilter}
          onSort={props.onSort}
        />
      </Grid>
      <Modal
        open={props.editPlateModal}
        onClose={props.closeEditPlateModal}
      >
        <Box component="form" onSubmit={props.handleEditPlate} sx={style}>
          <Grid container spacing={3} sx={{ placeContent: "center" }}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" color="primary" className="font-bold m-2 font-gray">
                {props.literals.edit_plate}
              </Typography>
            </Grid>
            <Grid item xs={6} align='right'>
              <IconButton color="primary" component="label" onClick={props.closeEditPlateModal}>
                <Close />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label={props.literals.plate}
                color="primary"
                name="plate"
                value={props.inputField.plate}
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
            <Grid item xs={12} align='right'>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                size="small"
              >
                {props.literals.submit}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </Grid>
  );
}
