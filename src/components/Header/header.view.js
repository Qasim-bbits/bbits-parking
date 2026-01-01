import styled from '@emotion/styled';
import {AppBar, Box, FormControl, IconButton, InputLabel, MenuItem, Select, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { router } from '../../Routes/routhPaths';

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.shadows[3]
}));

export const HeaderView = (props) => {
  let navigate = useNavigate();
  const { onSidebarOpen, ...other } = props;

  const logout = () =>{
    sessionStorage.removeItem("userLogged");
    navigate(router.login)
  }

  return (
    <>
      <DashboardNavbarRoot
        sx={{
          left: {
            lg: 280,
          },
          width: {
            lg: 'calc(100% - 280px)',
          }
        }}
        {...other}>
        <Toolbar
          disableGutters
          sx={{
            minHeight: 64,
            px: 2,
            justifyContent: 'space-between',
          }}
        >
          <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'flex',
                lg: 'none'
              },
              color: '#fff',
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>
          {props.zone && <Typography variant='subtitle1'>
            {props.zone?.zone_name}
          </Typography>}
          <Box sx={{display: 'flex', alignItems: 'center'}}>
            <FormControl variant="standard">
              <Select
                sx={{
                  color: '#fff', // text color
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fff', // border color
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fff',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#fff',
                  },
                  '& .MuiSvgIcon-root': {
                    color: '#fff', // icon color
                  },
                }}
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                label="Language"
                name={'language'}
                value={props.selectedLanguage}
                onChange={(e)=>props.getLiterals(e.target.value)}
              >
                <MenuItem value={'en'}>En</MenuItem>
                <MenuItem value={'fr'}>Fr</MenuItem>
              </Select>
            </FormControl>
            <IconButton sx={{color: '#fff'}} onClick={()=>logout()}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </DashboardNavbarRoot>
    </>
  );
};
