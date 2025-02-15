import React from 'react';
import {Box, Fade, IconButton, Menu, MenuItem, Toolbar} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import { router } from '../Routes/routhPaths';
import { useNavigate } from 'react-router-dom';
import { config } from '../Constants';

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
}));

export const AgentHeader = (props) => {
  const { children } = props;
  let navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () =>{
    sessionStorage.removeItem("userLogged");
    navigate(router.agentSignin)
  }

  return (
    <>
      <LayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
            backgroundColor: '#fff',
            overflow: 'auto',
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              minHeight: 64,
              maxHeight: 0,
              px: 4,
              justifyContent: 'space-between',
            }}
          >
            <img src={config.url.file_url+props.org.logo} variant='square' style={{height: "100%"}}/>
            <IconButton onClick={handleClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              TransitionComponent={Fade}
            >
              <MenuItem onClick={()=>navigate(router.agentIssueTicket)}>Issue Ticket</MenuItem>
              <MenuItem onClick={()=>navigate(router.agentHistory)}>History</MenuItem>
              <MenuItem onClick={()=>logout()}>Logout</MenuItem>
            </Menu>
          </Toolbar>
          {children}
        </Box>
      </LayoutRoot>
    </>
  );
};
