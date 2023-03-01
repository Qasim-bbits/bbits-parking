import React from "react";
import { alpha, styled } from '@mui/material/styles';
import { 
    Button, Typography, Table, TableBody, TableContainer,
    TableHead, TableRow, Paper, TablePagination, Switch,
    Collapse, IconButton, InputBase, Grid
} from "@mui/material";
import { createTheme , ThemeProvider } from "@mui/material/styles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import { DeleteForeverOutlined, EditOutlined, KeyboardArrowDown, KeyboardArrowUp, Search } from "@mui/icons-material";
import moment from "moment";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00981b"
    },
    secondary: {
      main: "#ffa500"
    },
    error: {
      main: "#dc3427"
    }
  }
});

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

export default function TicketsIssuedView(props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [open, setOpen] = React.useState('');

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    
    return (
      <Grid container spacing={3} sx={{placeContent: "center", py: 2}}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" color="primary" className="font-bold font-gray">{props.literals.tickets_issued}</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          {/* <Button 
              type="button"
              variant="contained"
              color="primary"
              sx={{minWidth:110}}
              onClick={props.setOpenDrawer}
          >
            {props.literals.add} +
          </Button> */}
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
                            {/* <StyledTableCell></StyledTableCell> */}
                            <StyledTableCell>{props.literals.organization}</StyledTableCell>
                            <StyledTableCell>{props.literals.city_name}</StyledTableCell>
                            <StyledTableCell>{props.literals.zone_name}</StyledTableCell>
                            <StyledTableCell>{props.literals.ticket_num}</StyledTableCell>
                            <StyledTableCell>{props.literals.ticket_name}</StyledTableCell>
                            <StyledTableCell>{props.literals.plate}</StyledTableCell>
                            <StyledTableCell>{props.literals.issued_at}</StyledTableCell>
                            <StyledTableCell>{props.literals.amount}</StyledTableCell>
                            <StyledTableCell>{props.literals.paid_at}</StyledTableCell>
                            <StyledTableCell>{props.literals.parking_id}</StyledTableCell>
                            <StyledTableCell>{props.literals.parking_status}</StyledTableCell>
                            <StyledTableCell>{props.literals.ticket_status}</StyledTableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {props.ticketsIssued
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            
                              return (
                                  <>
                                      <TableRow key={row.ticket_name}>
                                          {/* <TableCell>
                                              <IconButton
                                                aria-label="expand row"
                                                size="small"
                                                onClick={() => {
                                                    setOpen((row._id === open ? "" : row._id));
                                                    props.getAgingByTicket(row._id);
                                                }}
                                              >
                                                {open === row._id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                              </IconButton>
                                          </TableCell> */}
                                          <TableCell>{row.org?.org_name}</TableCell>
                                          <TableCell>{row.city?.city_name}</TableCell>
                                          <TableCell>{row.zone?.zone_name}</TableCell>
                                          <TableCell>{row.ticket_num}</TableCell>
                                          <TableCell>{row.ticket?.ticket_name}</TableCell>
                                          <TableCell>{row.plate}</TableCell>
                                          <TableCell>{moment(row.issued_at).format('MMM Do YY, hh:mm a')}</TableCell>
                                          <TableCell>{(row.amount !== undefined) ? '$ '+(row.amount/100).toFixed(2) : ''}</TableCell>
                                          <TableCell>{(row.paid_at !== undefined) ? moment(row.paid_at).format('MMM Do YY, hh:mm a') : ''}</TableCell>
                                          <TableCell>{row.parking?.parking_id}</TableCell>
                                          <TableCell>
                                            <ThemeProvider theme={theme}>
                                              <Button 
                                                variant="outlined"
                                                color={(row.parking_status == 'paid') ? "primary" : (row.parking_status == 'unpaid')? "error" : "secondary"}
                                                size="small"
                                                sx={{px:2, borderRadius: '20px', fontSize: '12px'}}
                                              >
                                                {props.literals[row.parking_status]}
                                              </Button>
                                            </ThemeProvider>
                                          </TableCell>
                                          <TableCell>
                                            <ThemeProvider theme={theme}>
                                              <Button 
                                                variant="outlined"
                                                color={(row.parking_status == 'paid') ? "primary" : "error"}
                                                size="small"
                                                sx={{px:2, borderRadius: '20px', fontSize: '12px'}}
                                              >
                                                {props.literals[row.ticket_status]}
                                              </Button>
                                            </ThemeProvider>
                                          </TableCell>
                                          {/* <TableCell>
                                              <Button 
                                                  type="button" 
                                                  onClick={()=>props.delItem(row._id)} 
                                                  sx={{color: '#bc0000', background: '#bc00002e', p: '2px', minWidth: 0, m: 1}}
                                              >
                                                  <DeleteForeverOutlined />
                                              </Button>
                                              <Button
                                                  type="button"
                                                  onClick={()=>{props.onEdit(row);setOpen("")}}
                                                  sx={{color: '#027c92', background: '#027c924d', p: '2px', minWidth: 0, m: 1}}
                                              >
                                                  <EditOutlined/>
                                              </Button>
                                          </TableCell> */}
                                      </TableRow>
                                      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                              <Collapse in={open === row._id} timeout="auto" unmountOnExit>
                                                  <Paper elevation={1} sx={{ margin: 1 }}>
                                                    <Table size="small">
                                                      <TableHead>
                                                        <TableRow>
                                                            <StyledTableCell>{props.literals.rate}</StyledTableCell>
                                                            <StyledTableCell>{props.literals.ticket_aging}</StyledTableCell>
                                                        </TableRow>
                                                      </TableHead>
                                                      {props.aging.map(x=>{
                                                        return(
                                                          <TableBody>
                                                            <TableRow>
                                                                <TableCell>$ {x.rate/100}</TableCell>
                                                                <TableCell>
                                                                  {(x.applied_from == 0) ? props.literals.within + ' '+ (x.applied_to/24/60) +' '+props.literals.days :  
                                                                  (x.applied_to == null) ? props.literals.after + ' ' + (x.applied_from/24/60 +' '+props.literals.days) : 
                                                                  props.literals.within + ' ' + (x.applied_from/24/60) +' '+props.literals.to+' '+ (x.applied_to/24/60) +' '+props.literals.days}
                                                                </TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                        )
                                                      })}
                                                    </Table>
                                                  </Paper>
                                              </Collapse>
                                          </TableCell>
                                      </TableRow>
                                  </>
                              );
                          })}
                      </TableBody>
                  </Table>
              </TableContainer>
              <TablePagination
                  rowsPerPageOptions={[10, 25, 100, { label: 'All', value: props.ticketsIssued.length }]}
                  component="div"
                  count={props.ticketsIssued.length}
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
