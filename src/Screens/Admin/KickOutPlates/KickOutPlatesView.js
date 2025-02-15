import React from "react";
import { alpha, styled } from '@mui/material/styles';
import { 
    Button, Typography, Table, TableBody, TableContainer,
    TableHead, TableRow, Paper, TablePagination, Switch,
    Collapse, IconButton, InputBase, Grid
} from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { DeleteForeverOutlined, EditOutlined, KeyboardArrowDown, KeyboardArrowUp, Search } from "@mui/icons-material";
import moment from 'moment';

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

export default function KickOutPlatesView(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
    return (
      <Grid container spacing={3} sx={{py: 2}}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" color="primary" className="font-bold font-gray">{props.literals.kick_out_plates}</Typography>
        </Grid>
        {/* <Grid item xs={6} sm={12} md={6} lg={6}>
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
        </Grid> */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ height: '65vh' }}>
                  <Table aria-label="collapsible table" size="small">
                      <TableHead>
                          <TableRow>
                              <StyledTableCell>{props.literals.organization}</StyledTableCell>
                              <StyledTableCell>{props.literals.city_name}</StyledTableCell>
                              <StyledTableCell>{props.literals.zone_name}</StyledTableCell>
                              <StyledTableCell>{props.literals.parking_id}</StyledTableCell>
                              <StyledTableCell>{props.literals.kick_out_plate}</StyledTableCell>
                              <StyledTableCell>{props.literals.kick_out_by}</StyledTableCell>
                              <StyledTableCell>{props.literals.kick_out_at}</StyledTableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {props.kickOutPlates
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            
                              return (
                                  <>
                                      <TableRow key={row.parking_id}>
                                          <TableCell>{row.org?.org_name}</TableCell>
                                          <TableCell>{row.city?.city_name}</TableCell>
                                          <TableCell>{row.zone?.zone_name}</TableCell>
                                          <TableCell>{row.parking?.parking_id}</TableCell>
                                          <TableCell>{row.kicked_out_plate}</TableCell>
                                          <TableCell>{row.kicked_out_By}</TableCell>
                                          <TableCell>{moment(row.createdAt).format('ll hh:mm a')}</TableCell>
                                      </TableRow>
                                  </>
                              );
                          })}
                      </TableBody>
                  </Table>
              </TableContainer>
              <TablePagination
                  rowsPerPageOptions={[10, 25, 100, { label: 'All', value: props.kickOutPlates.length }]}
                  component="div"
                  count={props.kickOutPlates.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  SelectProps={{
                      MenuProps: { classes: "selectDropdown" }
                  }}
              />
          </Paper> 
        </Grid>
      </Grid>
    );
}
