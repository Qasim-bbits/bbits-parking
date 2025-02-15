import React from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment';
import { useTheme } from "@mui/styles";
import helpers from "../../../Helpers/Helpers";
import { DeleteForeverOutlined } from "@mui/icons-material";

export default function TicketsIssuedView(props) {
  const theme = useTheme();
  const columns = [
    { field: 'org', headerName: props.literals.organization, valueGetter: (params) => params.row?.org?.org_name, width: 200, headerClassName: 'header' },
    { field: 'city', headerName: props.literals.city_name, valueGetter: (params) => params.row?.city?.city_name, width: 200, headerClassName: 'header' },
    { field: 'zone', headerName: props.literals.zone_name, valueGetter: (params) => params.row?.zone?.zone_name, width: 300, headerClassName: 'header' },
    { field: 'ticket_num', headerName: props.literals.ticket_num, width: 150, headerClassName: 'header' },
    { field: 'ticket_name', headerName: props.literals.ticket_name, valueGetter: (params) => params.row?.ticket?.ticket_name, width: 600, headerClassName: 'header' },
    { field: 'plate', headerName: props.literals.plate, width: 150, headerClassName: 'header'},
    { field: 'issued_at', headerName: props.literals.issued_at, valueGetter: (params) => moment(params.row.issued_at).format('ll hh:mm a'), width: 250, headerClassName: 'header'},
    { field: 'amount', headerName: props.literals.amount, valueGetter: (params) => '$ '+(params.row?.amount/100 || 0).toFixed(2), width: 150, headerClassName: 'header'},
    { field: 'paid_at', headerName: props.literals.paid_at, valueGetter: (params) => (params.row.paid_at) ? moment(params.row.paid_at).format('ll hh:mm a') : '', width: 250, headerClassName: 'header'},
    { field: 'parking_id', headerName: props.literals.parking_id, width: 200, headerClassName: 'header' },
    {
      field: 'parking_status',
      headerName: props.literals.parking_status,
      width: 150,
      headerClassName: 'header',
      renderCell: (params) => (
        <Button 
          variant="outlined"
          color={(params.row.parking_status == 'paid') ? "success" : (params.row.parking_status == 'unpaid')? "error" : "secondary"}
          size="small"
          sx={{px:2, borderRadius: '20px', fontSize: '12px'}}
        >
          {props.literals[params.row.parking_status]}
        </Button>
      )
    },
    {
      field: 'ticket_status', 
      headerName: props.literals.ticket_status,
      width: 150,
      headerClassName: 'header',
      renderCell: (params) => (
        <Button 
          variant="outlined"
          color={(params.row.ticket_status == 'paid') ? "success" : (params.row.ticket_status == 'unpaid')? "error" : "secondary"}
          size="small"
          sx={{px:2, borderRadius: '20px', fontSize: '12px'}}
        >
          {props.literals[params.row.ticket_status]}
        </Button>
      )
    },
    {
      field: 'action', 
      headerName: props.literals.action,
      width: 150,
      headerClassName: 'header',
      renderCell: (params) => (
        <Button 
            type="button" 
            disabled={helpers.abilityByModuleKey('tickets_issued').can_delete == false}
            onClick={()=>props.delItem(params.row._id)} 
            sx={{color: '#bc0000', background: '#bc00002e', p: '2px', minWidth: 0, m: 1}}
        >
            <DeleteForeverOutlined />
        </Button>
      )
    },
  ]

  return (
    <Grid container spacing={3} sx={{placeContent: "center", py: 2}}>
      <Grid item xs={12}>
        <Typography variant="subtitle1" color="primary" className="font-bold font-gray">{props.literals.tickets_issued}</Typography>
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
            rows={props.ticketsIssued }
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
