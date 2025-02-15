import React from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useTheme } from "@mui/styles";
const moment = require('moment-timezone');

export default function ParkingsView(props) {
  moment.tz.setDefault(moment.tz.guess());
  const theme = useTheme();
  const columns = [
    { field: 'parking_id', headerName: 'Parking ID', width: 100, headerClassName: 'header' },
    { field: 'org', headerName: 'Organization', valueGetter: (params) => params.row?.org?.org_name, width: 150, headerClassName: 'header' },
    { field: 'zone', headerName: 'Zone', valueGetter: (params) => params.row?.zone?.zone_name, width: 250, headerClassName: 'header' },
    { field: 'city', headerName: 'City', valueGetter: (params) => params.row?.city?.city_name, width: 150, headerClassName: 'header' },
    { field: 'fname', headerName: 'User Name', valueGetter: (params) => params.row?.user?.fname, width: 150, headerClassName: 'header' },
    { field: 'email', headerName: 'User Email', valueGetter: (params) => params.row?.user?.email, width: 200, headerClassName: 'header' },
    { field: 'plate', headerName: 'Plate', width: 150, headerClassName: 'header'},
    { field: 'plate_two', headerName: 'Plate Two', width: 150, headerClassName: 'header'},
    { field: 'plate_three', headerName: 'Plate Three', width: 150, headerClassName: 'header'},
    { field: 'amount', headerName: 'Amount', valueGetter: (params) => '$ '+(params.row?.amount/100).toFixed(2), width: 150, headerClassName: 'header'},
    { field: 'from', headerName: 'Start Date/Time', valueGetter: (params) => moment(params.row.from).format('ll hh:mm a'), width: 200, headerClassName: 'header'},
    { field: 'to', headerName: 'End Date/Time', valueGetter: (params) => moment(params.row.to).format('ll hh:mm a'), width: 200, headerClassName: 'header'},
    {
      field: 'action', 
      headerName: props.literals.action,
      width: 200,
      headerClassName: 'header',
      renderCell: (params) => (
        <>
          {params.row.zone?.enable_parking_limit &&
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
          {params.row.zone?.can_user_kick_out && (moment() < moment(params.row.to)) &&
            <Button 
              variant="outlined"
              color="primary"
              size="small"
              onClick={()=>props.conFirmKickOutPlate(params.row)}
            >
              {props.literals.kick_out}
            </Button>
          }
        </>
      )
    },
  ]
  
  return (
    <Grid container spacing={3} sx={{placeContent: "center"}}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" color="primary">{props.literals.parkings}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            height: '75vh',
            width: '100%',
            '& .header': {
              backgroundColor: theme.palette.primary.main,
              color: '#fff'
            },
          }}
        >
          <DataGrid
            getRowId={(row) => row._id}
            rows={props.parking }
            columns={columns}
            disableSelectionOnClick={true}
            components={{ Toolbar: GridToolbar }} 
            density={'compact'}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
