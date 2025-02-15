import React from "react";
import { alpha, styled } from '@mui/material/styles';
import { 
    Button, Typography, Table, TableBody, TableContainer,
    TableHead, TableRow, Paper, TablePagination, Switch,
    Collapse, IconButton, TableFooter, Grid,
    Menu,
    MenuItem
} from "@mui/material";
import { createTheme , ThemeProvider } from "@mui/material/styles";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import moment from "moment";
import { FileDownloadOutlined, FilterAltOutlined } from "@mui/icons-material";

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

export default function ReportingView(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
    
    return (
      <Grid container spacing={3} sx={{placeContent: "center", py: 2}}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" color="primary" className="font-bold font-gray">
            {props.filterBy == 'parking' ? "Parkings" : "Tickets Issued"} Report
          </Typography>
        </Grid>
        <Grid item xs={6} align="right">
          {props.report.length > 0 &&<IconButton 
            type="button"
            variant="contained"
            color="primary"
            onClick={(event)=>setAnchorEl(event.currentTarget)}
          >
            <FileDownloadOutlined/>
          </IconButton>}
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={()=>setAnchorEl(null)}
          >
            <MenuItem onClick={()=>props.exportPDF()}>PDF</MenuItem>
            <MenuItem onClick={()=>props.exportCSV()}>CSV</MenuItem>
          </Menu>
          <Button 
              type="button"
              variant="contained"
              color="primary"
              sx={{minWidth:110}}
              onClick={props.setOpenDrawer}
          >
            <FilterAltOutlined/> {props.literals.filter}
          </Button>
        </Grid>
        {props.filterBy == 'parking' && <Grid item xs={12}>
          <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ height: '65vh' }}>
                  <Table aria-label="collapsible table" size="small">
                      <TableHead>
                      <TableRow>
                            <StyledTableCell>{props.literals.organization}</StyledTableCell>
                            <StyledTableCell>{props.literals.city_name}</StyledTableCell>
                            <StyledTableCell>{props.literals.zone_name}</StyledTableCell>
                            {!props.selectedGroup && <>
                              <StyledTableCell>{props.literals.email}</StyledTableCell>
                              <StyledTableCell>{props.literals.parking_id}</StyledTableCell>
                              <StyledTableCell>{props.literals.plate}</StyledTableCell>
                            </>}
                            {props.selectedGroup && <>
                              <StyledTableCell>No of Parkings</StyledTableCell>
                            </>}
                            <StyledTableCell>{props.literals.service_fee}</StyledTableCell>
                            <StyledTableCell>{props.literals.amount}</StyledTableCell>
                            {!props.selectedGroup && <>
                              <StyledTableCell>{props.literals.start_date_time} - {props.literals.end_date_time}</StyledTableCell>
                            </>}
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {props.report.map((row) => {
                              return (
                                  <>
                                      <TableRow key={row.ticket_name}>
                                          <TableCell>{row.org?.org_name}</TableCell>
                                          <TableCell>{row.city?.city_name}</TableCell>
                                          <TableCell>{row.zone?.zone_name}</TableCell>
                                          {!props.selectedGroup && <>
                                            <TableCell>{row.user?.email}</TableCell>
                                            <TableCell>{row.parking_id}</TableCell>
                                            <TableCell>{row.plate}</TableCell>
                                          </>}
                                          {props.selectedGroup && <>
                                            <TableCell>{row.total_parking}</TableCell>
                                          </>}
                                          <TableCell>$ {(parseInt(row.service_fee)/100).toFixed(2)}</TableCell>
                                          <TableCell>$ {(row.amount/100).toFixed(2)}</TableCell>
                                          {!props.selectedGroup && <>
                                            <TableCell>{moment(row.from).format('MMM Do YY, hh:mm a')} - {moment(row.to).format('MMM Do YY, hh:mm a')}</TableCell>
                                          </>}
                                      </TableRow>
                                  </>
                              );
                          })}
                      {props.report.length == 0 && 
                        <TableRow sx={{height: '50vh'}}>
                          <TableCell align="center" colspan={9}>No record found</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell rowSpan={4} />
                        <TableCell colSpan={props.selectedGroup? 3 : 6} sx={{border: 0}}></TableCell>
                        <TableCell colSpan={1}>Parkings</TableCell>
                        <TableCell align="right">{props.total.total_parkings}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={props.selectedGroup? 3 : 6} sx={{border: 0}}></TableCell>
                        <TableCell colSpan={1}>Plates</TableCell>
                        <TableCell align="right">{props.total.total_plates}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={props.selectedGroup? 3 : 6} sx={{border: 0}}></TableCell>
                        <TableCell colSpan={1}>Service Fee</TableCell>
                        <TableCell align="right">$ {(parseInt(props.total.service_fee)/100).toFixed(2)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={props.selectedGroup? 3 : 6} sx={{border: 0}}></TableCell>
                        <TableCell colSpan={1} sx={{fontWeight: "bold"}}>Total Amount</TableCell>
                        <TableCell align="right" sx={{fontWeight: "bold"}}>$ {(parseInt(props.total.amount)/100).toFixed(2)}</TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
              </TableContainer>
          </Paper> 
        </Grid>}
        {props.filterBy !== 'parking' && <Grid item xs={12}>
        <Paper elevation={1} sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer>
                <Table aria-label="collapsible table" size="small">
                    <TableHead>
                        <TableRow>
                          <StyledTableCell>{props.literals.organization}</StyledTableCell>
                          <StyledTableCell>{props.literals.city_name}</StyledTableCell>
                          <StyledTableCell>{props.literals.zone_name}</StyledTableCell>
                          <StyledTableCell>{props.literals.ticket_name}</StyledTableCell>
                          <StyledTableCell>Issued By</StyledTableCell>
                          <StyledTableCell>{props.literals.plate}</StyledTableCell>
                          <StyledTableCell>{props.literals.ticket_num}</StyledTableCell>
                          <StyledTableCell>Amount Paid</StyledTableCell>
                          <StyledTableCell>{props.literals.parking_status}</StyledTableCell>
                          <StyledTableCell>{props.literals.ticket_status}</StyledTableCell>
                          <StyledTableCell>{props.literals.issued_at}</StyledTableCell>
                          <StyledTableCell>Paid at</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.report.map((row) => {
                            return (
                                <>
                                    <TableRow key={row.ticket_name}>
                                        <TableCell>{row.org?.org_name}</TableCell>
                                        <TableCell>{row.city?.city_name}</TableCell>
                                        <TableCell>{row.zone?.zone_name}</TableCell>
                                        <TableCell>{row.ticket?.ticket_name}</TableCell>
                                        <TableCell>{row.issued_by?.email}</TableCell>
                                        <TableCell>{row.plate}</TableCell>
                                        <TableCell>{row.ticket_num}</TableCell>
                                        <TableCell>{(row.amount) ? '$ '+(row.amount/100).toFixed(2) : ''}</TableCell>
                                        <TableCell>
                                          <Button 
                                            variant="outlined"
                                            color={(row.parking_status == 'paid') ? "primary" : (row.parking_status == 'unpaid')? "error" : "secondary"}
                                            size="small"
                                            sx={{px:2, borderRadius: '20px', fontSize: '12px'}}
                                          >
                                            {row.parking_status}
                                          </Button>
                                        </TableCell>
                                        <TableCell>
                                          <Button 
                                            variant="outlined"
                                            color={(row.ticket_status == 'paid') ? "primary" : (row.ticket_status == 'unpaid')? "error" : "secondary"}
                                            size="small"
                                            sx={{px:2, borderRadius: '20px', fontSize: '12px'}}
                                          >
                                            {row.ticket_status}
                                          </Button>
                                        </TableCell>
                                        <TableCell>{moment(row.issued_at).format('MMM Do YY, hh:mm a')}</TableCell>
                                        <TableCell>{moment(row.paid_at).format('MMM Do YY, hh:mm a')}</TableCell>
                                    </TableRow>
                                </>
                            );
                        })}
                        {props.report.length == 0 && 
                        <TableRow sx={{height: '50vh'}}>
                          <TableCell align="center" colspan={12}>No record found</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell rowSpan={4} />
                        <TableCell colSpan={8} sx={{border: 0}}></TableCell>
                        <TableCell colSpan={2}>Tickets issued</TableCell>
                        <TableCell align="right">{props.total.total_tickets_issued}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8} sx={{border: 0}}></TableCell>
                        <TableCell colSpan={2}>Tickets paid</TableCell>
                        <TableCell align="right">{props.total.total_tickets_paid}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8} sx={{border: 0}}></TableCell>
                        <TableCell colSpan={2}>Tickets unpaid</TableCell>
                        <TableCell align="right">{props.total.total_tickets_unpaid}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={8} sx={{border: 0}}></TableCell>
                        <TableCell colSpan={2} sx={{fontWeight: "bold"}}>Total Amount</TableCell>
                        <TableCell align="right" sx={{fontWeight: "bold"}}>$ {props.total.amount}</TableCell>
                      </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper> 
      </Grid>}
      </Grid>
    );
}
