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
  const user = JSON.parse(sessionStorage.getItem("userLogged"));

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
            alignItems: 'center',
            gap: 1,
          }}
        >
        {user && <IconButton
            onClick={onSidebarOpen}
            sx={{
              display: {
                xs: 'flex',
                lg: 'none'
              },
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <MenuIcon fontSize="small" />
          </IconButton>}
          {props.zone && <Box
            sx={{
              flex: '1 1 auto', // Allows container to expand/shrink dynamically
              minWidth: 0,      // Crucial: allows flex items to shrink below their text content width
              maxWidth: { xs: '150px', sm: '250px', md: '350px' }, // Set thresholds based on screen size
              mx: 1,
            }}
          >
            <Typography variant='subtitle1' noWrap 
              sx={{
              fontWeight: 'bold',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
              {props.zone?.org?.org_name}
            </Typography>
            <Typography variant='subtitle1' noWrap 
              sx={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
              {props.zone?.zone_name}
            </Typography>
            </Box>
            }
          <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
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
