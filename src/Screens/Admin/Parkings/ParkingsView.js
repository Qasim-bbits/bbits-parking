import React from "react";
import { alpha, styled } from '@mui/material/styles';
import { 
    Button, Typography, Table, TableBody, TableContainer,
    TableHead, TableRow, Paper, TablePagination, Switch, Box, 
    InputBase, Grid
} from "@mui/material";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { Search } from "@mui/icons-material";
import moment from 'moment';
import ParkIn from "../../../assets/icons/park_in.png"
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
    color: theme.palette.primary.main,
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
        border: '1px solid'+theme.palette.primary.main,
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

export default function ParkingsView(props) {
  const theme = useTheme();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const columns = [
      { field: 'parking_id', headerName: 'Parking ID', width: 100, headerClassName: 'header' },
      { field: 'org', headerName: 'Organization', valueGetter: (params) => params.row?.org?.org_name, width: 150, headerClassName: 'header' },
      { field: 'zone', headerName: 'Zone', valueGetter: (params) => params.row?.zone?.zone_name, width: 150, headerClassName: 'header' },
      { field: 'city', headerName: 'City', valueGetter: (params) => params.row?.city?.city_name, width: 150, headerClassName: 'header' },
      { field: 'fname', headerName: 'User Name', valueGetter: (params) => params.row?.user?.fname, width: 150, headerClassName: 'header' },
      { field: 'email', headerName: 'User Email', valueGetter: (params) => params.row?.user?.email, width: 200, headerClassName: 'header' },
      { field: 'plate', headerName: 'Plate', width: 150, headerClassName: 'header'},
      { field: 'amount', headerName: 'Amount', valueGetter: (params) => '$ '+(params.row?.amount/100).toFixed(2), width: 150, headerClassName: 'header'},
      { field: 'from', headerName: 'Start Date/Time', valueGetter: (params) => moment(params.row.from).format('ll hh:mm a'), width: 200, headerClassName: 'header'},
      { field: 'to', headerName: 'End Date/Time', valueGetter: (params) => moment(params.row.to).format('ll hh:mm a'), width: 200, headerClassName: 'header'},
    ]
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
    return (
      <Grid container spacing={3} sx={{placeContent: "center"}}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" color="primary">{props.literals.parkings}</Typography>
        </Grid>
        {/* <Grid item xs={12} sm={12} md={6} lg={6}>
          <SearchBar>
            <SearchIconWrapper>
                <Search />
            </SearchIconWrapper>
            <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
                value={props.searched}
                onChange={(e) => props.requestSearch(e.target.value)}
            />
          </SearchBar>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Grid container spacing={3} sx={{placeContent: "center"}}>
            <Grid item xs={6} align="end">
              <Button
                  type="submit"
                  color="primary"
                  variant="outlined"
                  onClick={()=>props.handleParkings(1)}
                  size="small">
                  <img alt = "Loading" src={ParkIn} width={'30px'}/>{props.literals.employee}
              </Button>
            </Grid>
            <Grid item xs={6} align="start">
              <Button 
                  type="submit"
                  color="primary"
                  variant="outlined"
                  onClick={()=>props.handleParkings()}
                  size="small">
                  <img alt = "Loading" src={ParkIn} width={'30px'}/>{props.literals.customer}
              </Button>
            </Grid>
          </Grid>
        </Grid> */}
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
          {/* <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ height: '65vh' }}>
                  <Table aria-label="collapsible table" size="small" exportButton={true}>
                      <TableHead>
                          <TableRow>
                              <StyledTableCell>{props.literals.parking_id}</StyledTableCell>
                              <StyledTableCell>{props.literals.organization}</StyledTableCell>
                              <StyledTableCell>{props.literals.zone}</StyledTableCell>
                              <StyledTableCell>{props.literals.city}</StyledTableCell>
                              <StyledTableCell>{props.literals.user_name}</StyledTableCell>
                              <StyledTableCell>{props.literals.user_email}</StyledTableCell>
                              <StyledTableCell>{props.literals.plate}</StyledTableCell>
                              <StyledTableCell>{props.literals.amount}</StyledTableCell>
                              <StyledTableCell>{props.literals.start_date_time}</StyledTableCell>
                              <StyledTableCell>{props.literals.end_date_time}</StyledTableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {props.parking
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            
                              return (
                                  <>
                                      <TableRow key={row.zone_name}>
                                          <TableCell>{row.parking_id}</TableCell>
                                          <TableCell>{row.org?.org_name}</TableCell>
                                          <TableCell>{(row.zone === undefined) ? "Preston Visitor Parking" : row.zone?.zone_name}</TableCell>
                                          <TableCell>{(row.city === undefined) ? "Ottawa" :row.city?.city_name}</TableCell>
                                          <TableCell>{row.user?.fname}</TableCell>
                                          <TableCell>{row.user?.email}</TableCell>
                                          <TableCell>{row.plate}</TableCell>
                                          <TableCell>${(row.amount/100).toFixed(2)}</TableCell>
                                          <TableCell>{moment(row.from).format('ll hh:mm a')}</TableCell>
                                          <TableCell>{moment(row.to).format('ll hh:mm a')}</TableCell>
                                      </TableRow>
                                  </>
                              );
                          })}
                      </TableBody>
                  </Table>
              </TableContainer>
              <TablePagination
                  rowsPerPageOptions={[10, 25, 100, { label: 'All', value: props.parking.length }]}
                  component="div"
                  count={props.parking.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  SelectProps={{
                      MenuProps: { classes: "selectDropdown" }
                  }}
              />
          </Paper>  */}
        </Grid>
      </Grid>
    );
}
