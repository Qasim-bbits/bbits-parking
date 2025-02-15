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

export default function BusinessPassPlatesView(props) {
  const theme = useTheme();
  const columns = [
    { field: 'org', headerName: 'Organization', valueGetter: (params) => params.row?.org?.org_name, width: 250, headerClassName: 'header' },
    { field: 'zone', headerName: 'Zone', valueGetter: (params) => params.row?.zone?.zone_name, width: 250, headerClassName: 'header' },
    { field: 'name', headerName: 'Name', valueGetter: (params) => params.row?.name, width: 250, headerClassName: 'header' },
    { field: 'notes', headerName: 'Notes', valueGetter: (params) => params.row?.notes, width: 600, headerClassName: 'header' },
    { field: 'plate', headerName: 'Plate', valueGetter: (params) => params.row?.plate, width: 250, headerClassName: 'header' },
    {
      field: 'action',
      headerName: props.literals.action,
      width: 250,
      headerClassName: 'header',
      renderCell: (params) => (
        <>
          <Button 
              type="button" 
              disabled={helpers.abilityByModuleKey('business_pass_plates').can_delete == false}
              onClick={()=>props.delItem(params.row._id)} 
              sx={{color: '#bc0000', background: '#bc00002e', p: '2px', minWidth: 0, m: 1}}
          >
              <DeleteForeverOutlined />
          </Button>
          <Button
              type="button"
              disabled={helpers.abilityByModuleKey('business_pass_plates').can_edit == false}
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
          <Typography variant="subtitle1" color="primary" className="font-bold font-gray">{props.literals.business_pass_plates}</Typography>
        </Grid>
        <Grid item xs={6} align="right">
          <Button 
              type="button"
              variant="contained"
              color="primary"
              sx={{minWidth:110}}
              onClick={props.setOpenDrawer}
              disabled={helpers.abilityByModuleKey('business_pass_plates').can_add == false}
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
              rows={props.businessPassPlates }
              columns={columns}
              disableSelectionOnClick={true}
              components={{ Toolbar: GridToolbar }} 
              density={'compact'}
            />
          </Box>
        </Grid>
        {/* <Grid item xs={12}>
          <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ height: '65vh' }}>
                  <Table aria-label="collapsible table" size="small">
                      <TableHead>
                          <TableRow>
                            <StyledTableCell>{props.literals.organization}</StyledTableCell>
                            <StyledTableCell>{props.literals.zone_name}</StyledTableCell>
                            <StyledTableCell>{props.literals.plate}</StyledTableCell>
                            <StyledTableCell>{props.literals.action}</StyledTableCell>
                          </TableRow>
                      </TableHead>
                      <TableBody>
                          {props.businessPassPlates
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .map((row) => {
                            
                              return (
                                  <>
                                      <TableRow key={row.plate}>
                                          <TableCell>{row.org?.org_name}</TableCell>
                                          <TableCell>{row.zone?.zone_name}</TableCell>
                                          <TableCell>{row.plate}</TableCell>
                                          <TableCell>
                                              <Button 
                                                  type="button" 
                                                  disabled={helpers.abilityByModuleKey('business_pass_plates').can_delete == false}
                                                  onClick={()=>props.delItem(row._id)} 
                                                  sx={{color: '#bc0000', background: '#bc00002e', p: '2px', minWidth: 0, m: 1}}
                                              >
                                                  <DeleteForeverOutlined />
                                              </Button>
                                              <Button
                                                  type="button"
                                                  disabled={helpers.abilityByModuleKey('business_pass_plates').can_edit == false}
                                                  onClick={()=>{props.onEdit(row);setOpen("")}}
                                                  sx={{color: '#027c92', background: '#027c924d', p: '2px', minWidth: 0, m: 1}}
                                              >
                                                  <EditOutlined/>
                                              </Button>
                                          </TableCell>
                                      </TableRow>
                                  </>
                              );
                          })}
                      </TableBody>
                  </Table>
              </TableContainer>
              <TablePagination
                  rowsPerPageOptions={[10, 25, 100, { label: 'All', value: props.businessPassPlates.length }]}
                  component="div"
                  count={props.businessPassPlates.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  SelectProps={{
                      MenuProps: { classes: "selectDropdown" }
                  }}
              />
          </Paper> 
        </Grid> */}
      </Grid>
    );
}
