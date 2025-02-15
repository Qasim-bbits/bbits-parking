import { AppBar, Box, Button, CssBaseline, Grid, Toolbar, useTheme } from '@mui/material';
import { Link, Outlet } from 'react-router-dom';
import { config } from '../Constants';
import { router } from '../Routes/routhPaths';

export default function NoAuthHeader(props){
  const theme = useTheme();

  return(
    <Grid >
      <Grid>
        <Box sx={{ flexGrow: 1 }}>
          <CssBaseline />
          <AppBar position="fixed">
            <Toolbar sx={{ backgroundColor: 'white'}} variant="dense">
              <Grid sx={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <img src={config.url.file_url+props.org?.logo} width= '200' alt="" />
                <Button variant="outlined" sx={{height: 'fit-content'}} component={Link} to={router.login}>Sign In</Button>
              </Grid>
            </Toolbar>
          </AppBar>
        </Box>
      </Grid>    
      <Grid item sx={{marginTop: '80px'}}>
        <Outlet />
      </Grid>     
    </Grid>
  )
};