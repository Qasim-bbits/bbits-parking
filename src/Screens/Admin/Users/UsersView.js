import React from "react";
import { alpha, styled } from '@mui/material/styles';
import { 
    Button, Typography, Table, TableBody, TableContainer,
    TableHead, TableRow, Paper, TablePagination, Switch,
    InputBase,
    Grid
} from "@mui/material";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import helpers from "../../../Helpers/Helpers";
import { DeleteForeverOutlined, Done, EditOutlined, Key, Password } from "@mui/icons-material";


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
      marginLeft: theme.spacing(3),
      width: 'auto',
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

export default function UsersView(props) {
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
        <Grid container spacing={3} sx={{placeContent: "center", py: 2}}>
            <Grid item xs={6}>
                <Typography variant="subtitle1" color="primary" className="font-bold font-gray"> {props.literals.users}</Typography>
            </Grid>
            <Grid item xs={6} align="right">
                <Button 
                    type="button"
                    variant="contained"
                    color="primary"
                    sx={{minWidth:110}}
                    onClick={props.setOpenDrawer}
                    disabled={helpers.abilityByModuleKey('users').can_add == false}
                >
                    {props.literals.add} +
                </Button>
            </Grid>
            <Grid item xs={12} alignSelf={"center"}>
                <Paper elevation={0} sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ height: '65vh' }}>
                        <Table aria-label="collapsible table" size="small">
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell></TableCell> */}
                                    <StyledTableCell>{props.literals.organization}</StyledTableCell>
                                    <StyledTableCell>{props.literals.name}</StyledTableCell>
                                    <StyledTableCell>{props.literals.email}</StyledTableCell>
                                    <StyledTableCell>{props.literals.address}</StyledTableCell>
                                    <StyledTableCell>{props.literals.phone_no}</StyledTableCell>
                                    <StyledTableCell>{props.literals.role}</StyledTableCell>
                                    <StyledTableCell>{props.literals.verified}</StyledTableCell>
                                    <StyledTableCell>Action</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {props.users
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => {
                                    
                                    return (
                                        <>
                                            <TableRow key={row.zone_name}>
                                                {/* <TableCell>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => {
                                                            if(open !== row._id){props.getRateDetail(row._id)};
                                                            setOpen((row._id === open ? "" : row._id))
                                                        }}
                                                    >
                                                        {open === row._id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                                                    </IconButton>
                                                </TableCell> */}
                                                <TableCell>
                                                    {row.org?.org_name}
                                                </TableCell>
                                                <TableCell>
                                                    {row.fname} {row.lname}
                                                </TableCell>
                                                <TableCell>
                                                    {row.email}
                                                </TableCell>
                                                <TableCell>
                                                    {row.address}
                                                </TableCell>
                                                <TableCell>
                                                    {row.mobile_no}
                                                </TableCell>
                                                <TableCell>
                                                    {(row.role === undefined) ? props.literals.user : row.role}
                                                </TableCell>
                                                <TableCell>
                                                    {(row.email_verified)? 'Yes' : 'No'}
                                                </TableCell>
                                                <TableCell >
                                                    <Button 
                                                        type="button" 
                                                        disabled={helpers.abilityByModuleKey('users').can_delete == false}
                                                        onClick={()=>props.delItem(row._id)} 
                                                        sx={{color: '#bc0000', background: '#bc00002e', p: '2px', minWidth: 0, m: 1}}
                                                    >
                                                        <DeleteForeverOutlined />
                                                    </Button>
                                                    <Button
                                                        type="button" 
                                                        disabled={helpers.abilityByModuleKey('users').can_edit == false}
                                                        onClick={()=>{props.onEdit(row)}}
                                                        sx={{color: '#027c92', background: '#027c924d', p: '2px', minWidth: 0, m: 1}}
                                                    >
                                                        <EditOutlined/>
                                                    </Button>
                                                    <Button
                                                        type="button" 
                                                        disabled={helpers.abilityByModuleKey('users').can_edit == false}
                                                        onClick={()=>{props.passwordModel(row)}}
                                                        sx={{color: '#dc9003', background: '#ffa50061', p: '2px', minWidth: 0, m: 1}}
                                                    >
                                                        <Key/>
                                                    </Button>
                                                    {!row.email_verified && <Button
                                                        type="button" 
                                                        disabled={helpers.abilityByModuleKey('users').can_edit == false}
                                                        onClick={()=>{props.onVerify(row)}}
                                                        sx={{color: '#029225', background: '#0292254f', p: '2px', minWidth: 0, m: 1}}
                                                    >
                                                        <Done/>
                                                    </Button>}
                                                </TableCell>
                                            </TableRow>
                                            {/* <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                                    <Collapse in={open === row._id} timeout="auto" unmountOnExit>
                                                        {props.rateDetail.length>0 && <Paper elevation={1} sx={{ margin: 1 }}>
                                                            <Table>
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell>Rate</TableCell>
                                                                    <TableCell>Rate Type</TableCell>
                                                                    <TableCell>Steps</TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            {props.rateDetail.map(x=>{
                                                                return(
                                                                <TableBody>
                                                                    <TableRow>
                                                                        <TableCell>{x.rate_name}</TableCell>
                                                                        <TableCell>{x.rate_type}</TableCell>
                                                                        <TableCell>
                                                                        {x.rate_step.map(y=>{
                                                                            return(
                                                                            <>
                                                                                <span>{y.time/60}h/${y.rate/100}</span><br/>
                                                                            </>
                                                                            )
                                                                        })}
                                                                        </TableCell>
                                                                    </TableRow>
                                                                </TableBody>
                                                                )
                                                            })}
                                                            </Table>
                                                        </Paper>}
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow> */}
                                        </>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100, { label: 'All', value: props.users.length }]}
                        component="div"
                        count={props.users.length}
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
