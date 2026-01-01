import React from "react";
import { Typography, Box, Grid, Button } from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import moment from 'moment-timezone';
import { useTheme } from "@mui/styles";
import helpers from "../../../Helpers/Helpers";
import { DeleteForeverOutlined, ImageOutlined } from "@mui/icons-material";
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

const customStyles = {
  overlay: {
    zIndex: 1200
  },
};

export default function TicketsIssuedView(props) {
  const theme = useTheme();
  const columns = [
    { field: 'org', headerName: props.literals.organization, valueGetter: (params) => params.row?.org?.org_name, width: 200, headerClassName: 'header' },
    { field: 'city', headerName: props.literals.city_name, valueGetter: (params) => params.row?.city?.city_name, width: 200, headerClassName: 'header' },
    { field: 'zone', headerName: props.literals.zone_name, valueGetter: (params) => params.row?.zone?.zone_name, width: 300, headerClassName: 'header' },
    { field: 'ticket_num', headerName: props.literals.ticket_num, width: 150, headerClassName: 'header' },
    { field: 'ticket_name', headerName: props.literals.ticket_name, valueGetter: (params) => params.row?.ticket?.ticket_name, width: 600, headerClassName: 'header' },
    { field: 'public_note', headerName: props.literals.public_note, valueGetter: (params) => params.row?.public_note, width: 600, headerClassName: 'header' },
    { field: 'private_note', headerName: props.literals.private_note, valueGetter: (params) => params.row?.private_note, width: 600, headerClassName: 'header' },
    { field: 'plate', headerName: props.literals.plate, width: 150, headerClassName: 'header' },
    { field: 'issued_at', headerName: props.literals.issued_at, valueGetter: (params) => moment(params.row.issued_at).tz(params.row?.city?.time_zone ? params.row?.city?.time_zone : 'America/New_York').format('ll hh:mm a'), width: 250, headerClassName: 'header' },
    { field: 'amount', headerName: props.literals.amount, valueGetter: (params) => '$ ' + (params.row?.amount / 100 || 0).toFixed(2), width: 150, headerClassName: 'header' },
    { field: 'paid_at', headerName: props.literals.paid_at, valueGetter: (params) => (params.row.paid_at) ? moment(params.row.paid_at).format('ll hh:mm a') : '', width: 250, headerClassName: 'header' },
    { field: 'parking_id', headerName: props.literals.parking_id, width: 200, headerClassName: 'header' },
    {
      field: 'parking_status',
      headerName: props.literals.parking_status,
      width: 150,
      headerClassName: 'header',
      renderCell: (params) => (
        <Button
          variant="outlined"
          color={(params.row.parking_status == 'paid') ? "success" : (params.row.parking_status == 'unpaid') ? "error" : "secondary"}
          size="small"
          sx={{ px: 2, borderRadius: '20px', fontSize: '12px' }}
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
          color={(params.row.ticket_status == 'paid') ? "success" : (params.row.ticket_status == 'unpaid') ? "error" : "secondary"}
          size="small"
          sx={{ px: 2, borderRadius: '20px', fontSize: '12px' }}
        >
          {props.literals[params.row.ticket_status]}
        </Button>
      )
    },
    {
      field: 'image',
      headerName: props.literals.images,
      width: 150,
      headerClassName: 'header',
      renderCell: (params) => (
        <>
          <Button
            type="button"
            onClick={() => props.getTicketDetail(params.row._id)}
            sx={{ color: '#bc0000', background: '#bc00002e', p: '2px', minWidth: 0, m: 1 }}
          >
            <ImageOutlined />
          </Button>
        </>
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
          onClick={() => props.delItem(params.row._id)}
          sx={{ color: '#bc0000', background: '#bc00002e', p: '2px', minWidth: 0, m: 1 }}
        >
          <DeleteForeverOutlined />
        </Button>
      )
    },
  ]

  return (
    <Grid container spacing={3} sx={{ placeContent: "center", py: 2 }}>
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
            rows={props.ticketsIssued}
            columns={columns}
            disableSelectionOnClick={true}
            components={{ Toolbar: GridToolbar }}
            density={'compact'}
          />
        </Box>
      </Grid>
      {props.ticketDetailModel && (
        <Lightbox
          reactModalStyle={customStyles}
          mainSrc={props.ticketDetail?.images[props.photoIndex]}
          nextSrc={props.ticketDetail?.images[(props.photoIndex + 1) % props.ticketDetail?.images.length]}
          prevSrc={props.ticketDetail?.images[(props.photoIndex + props.ticketDetail?.images.length - 1) % props.ticketDetail?.images.length]}
          onCloseRequest={props.closeTicketDetailModel}
          onMovePrevRequest={() =>
            props.setPhotoIndex((props.photoIndex + props.ticketDetail?.images.length - 1) % props.ticketDetail?.images.length)
          }
          onMoveNextRequest={() =>
            props.setPhotoIndex((props.photoIndex + 1) % props.ticketDetail?.images.length)
          }
        />
      )}
    </Grid>
  );
}
