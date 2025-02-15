import React from "react";
import { alpha, styled } from '@mui/material/styles';
import { 
    Button, Typography, Table, TableBody, TableContainer,
    TableHead, TableRow, Paper, TablePagination, Switch,
    Collapse, IconButton, InputBase, Grid, Box
} from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { DeleteForeverOutlined, EditOutlined, KeyboardArrowDown, KeyboardArrowUp, Search } from "@mui/icons-material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import helpers from "../../../Helpers/Helpers";
import { useTheme } from "@mui/styles";

const SearchBar = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        border: '1px solid #c9c6c6',
        borderRadius: '5px'
    },
  }));


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

export default function ResidantPlatesView(props) {
  const theme = useTheme();
  const columns = [
    { field: 'org', headerName: 'Organization', valueGetter: (params) => params.row?.org?.org_name, width: 150, headerClassName: 'header' },
    { field: 'zone', headerName: 'Zone', width: 250, headerClassName: 'header', renderCell: (params) => (
      <>
        {params.row.zone.map(x => {
          return(
            <>
              {x.zone_name}<br/>
            </>
          )
        })}
      </>
    )},
    { field: 'user', headerName: 'User Name', valueGetter: (params) => params.row?.user?.fname, width: 250, headerClassName: 'header' },
    { field: 'email', headerName: 'User Email', valueGetter: (params) => params.row?.user?.email, width: 250, headerClassName: 'header' },
    { field: 'no_of_visitors', headerName: 'Visitors Allowed', valueGetter: (params) => params.row?.user?.no_of_visitors, width: 150, headerClassName: 'header' },
    { field: 'plate', headerName: 'Plate One', valueGetter: (params) => params.row?.plate, width: 150, headerClassName: 'header' },
    { field: 'car_make', headerName: 'Vehicle 1 Car Make', valueGetter: (params) => params.row?.car_make, width: 150, headerClassName: 'header' },
    { field: 'model', headerName: 'Vehicle 1 Model', valueGetter: (params) => params.row?.model, width: 150, headerClassName: 'header' },
    { field: 'color', headerName: 'Vehicle 1 Color', valueGetter: (params) => params.row?.color, width: 150, headerClassName: 'header' },
    { field: 'plate_two', headerName: 'Plate Two', valueGetter: (params) => params.row?.plate_two, width: 150, headerClassName: 'header' },
    { field: 'car_make_two', headerName: 'Vehicle 2 Car Make', valueGetter: (params) => params.row?.car_make_two, width: 150, headerClassName: 'header' },
    { field: 'model_two', headerName: 'Vehicle 2 Model', valueGetter: (params) => params.row?.model_two, width: 150, headerClassName: 'header' },
    { field: 'color_two', headerName: 'Vehicle 2 Color', valueGetter: (params) => params.row?.color_two, width: 150, headerClassName: 'header' },
    { field: 'plate_three', headerName: 'Plate Three', valueGetter: (params) => params.row?.plate_three, width: 150, headerClassName: 'header' },
    { field: 'car_make_three', headerName: 'Vehicle 3 Car Make', valueGetter: (params) => params.row?.car_make_three, width: 150, headerClassName: 'header' },
    { field: 'model_three', headerName: 'Vehicle 3 Model', valueGetter: (params) => params.row?.model_three, width: 150, headerClassName: 'header' },
    { field: 'color_three', headerName: 'Vehicle 3 Color', valueGetter: (params) => params.row?.color_three, width: 150, headerClassName: 'header' },
    {
      field: 'action',
      headerName: props.literals.action,
      width: 150,
      headerClassName: 'header',
      renderCell: (params) => (
        <>
          <Button 
              type="button" 
              disabled={helpers.abilityByModuleKey('resident_plates').can_delete == false}
              onClick={()=>props.delItem(params.row._id)} 
              sx={{color: '#bc0000', background: '#bc00002e', p: '2px', minWidth: 0, m: 1}}
          >
              <DeleteForeverOutlined />
          </Button>
          <Button
              type="button"
              disabled={helpers.abilityByModuleKey('resident_plates').can_edit == false}
              onClick={()=>{props.onEdit(params.row)}}
              sx={{color: '#027c92', background: '#027c924d', p: '2px', minWidth: 0, m: 1}}
          >
              <EditOutlined/>
          </Button>
        </>
      )
    },
  ]
    
    return (
      <Grid container spacing={3} sx={{placeContent: "center", py: 2}}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" color="primary" className="font-bold font-gray">{props.literals.resident_plates}</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Button 
              type="button"
              variant="contained"
              color="primary"
              sx={{minWidth:110}}
              onClick={props.setOpenDrawer}
              disabled={helpers.abilityByModuleKey('resident_plates').can_add == false}
          >
            {props.literals.add} +
          </Button>
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
              rowHeight={100}
              getRowId={(row) => row._id}
              rows={props.residantPlates }
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
