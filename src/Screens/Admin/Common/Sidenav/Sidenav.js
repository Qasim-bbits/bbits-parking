import React, {useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { styled, useTheme} from "@mui/material/styles";
import logodashboard from "../../../../assets/images/Logos/logo.svg";
import adminRoutes from "../../../../Routes/adminRoutes";

import {
  Box,
  ListItemButton,
  Typography,
  Drawer,
  CssBaseline,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
  Avatar,
  Grid,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  AccountCircle,
  Login,
} from "@mui/icons-material";
import {router} from "../../../../Routes/routhPaths";
import { config } from "../../../../Constants";

const drawerWidth = 150;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export default function PersistentDrawerLeft(props) {
  const theme = useTheme();
  let navigate = useNavigate()
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const isAdmin = JSON.parse(sessionStorage.getItem('userLogged'));

  useEffect(()=>{
  },[])

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () =>{
    sessionStorage.removeItem("userLogged");
    setAnchorEl(null);
    navigate(router.login)
  }

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ backgroundColor: theme.palette.primary.main}} variant="dense">
          <IconButton
            color="primary"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              mr: 2,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon sx={{color: '#fff'}} />
          </IconButton>
          <Typography
            className="admin-text"
            color="primary"
            variant="h6"
            component="div"
            sx={{ flexGrow: 1}}
          >
            Welcome
          </Typography>

          <div>
            <IconButton
              sx={{color: '#fff'}}
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
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
              onClose={handleClose}
            >
              <MenuItem onClick={()=>{navigate(router.main)}}>{props.literals.web_app}</MenuItem>
              <MenuItem onClick={()=>{navigate(router.profile)}}>{props.literals.profile}</MenuItem>
              <MenuItem onClick={logout}>
                {(isAdmin?.result?.role !== 'user') ? props.literals.log_out : props.literals.log_in}
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        PaperProps={{
          sx: {
            backgroundColor: "#F0F2F5 !important",
            width:
              window.innerWidth > 700 ? "30% !important" : "100% !important",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Grid container spacing={2} sx={{placeContent: "center", my: 1}} alignItems="center">
          <Grid item xs={10} align="center">
            <img src={config.url.file_url+props.org?.logo} width= '70%' alt="" />
          </Grid>
          <Grid item xs={2} align="end">
            <IconButton onClick={handleDrawerClose} color="primary">
              {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </Grid>
        </Grid>

        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          sx={{ margin: "0px 30px" }}
        >
          {(isAdmin?.result?.role == 'user' && isAdmin?.result == undefined) && <ListItemButton>
            <Link
              to={{ pathname: router.login }}
              style={{ textDecoration: "none", display: "flex" }}
              onClick={handleDrawerClose}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: theme.palette.primary.main }}>
                <Login/>
              </ListItemIcon>
              <ListItemText sx={{ color: theme.palette.primary.main }} disableTypography>
                {props.literals.sign_up + ' / ' + props.literals.log_in}
              </ListItemText>
            </Link>
          </ListItemButton>}
          {(isAdmin?.result?.role !== 'user') && adminRoutes.map((x) => {
            let route = x.path.split('/');
            let access = isAdmin?.result?.permissions?.filter(y=>y.module.key.toLowerCase().includes(route[2]) == true);
            if(access[0]?.can_view == true || x.value == props.literals.web_app){
              return (
                <ListItemButton>
                  <Link
                    to={{ pathname: x.path }}
                    style={{ textDecoration: "none", display: "flex" }}
                    onClick={handleDrawerClose}
                  >
                    <ListItemIcon sx={{ minWidth: "40px", color: theme.palette.primary.main }}>
                      {x.icon}
                    </ListItemIcon>
                    <ListItemText sx={{ color: theme.palette.primary.main }} disableTypography>
                      {props.literals[x.value]}
                    </ListItemText>
                  </Link>
                </ListItemButton>
              );
            }
          })}
        </List>
      </Drawer>
    </Box>
  );
}
