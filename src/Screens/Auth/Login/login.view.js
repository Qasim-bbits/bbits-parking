import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ResponsiveCard from "../../User/ResponsiveCard";
import { router } from '../../../Routes/routhPaths';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { config } from '../../../Constants';

function LoginView(props) {
  const theme = useTheme();
  const btnstyle={margin:'8% 0', width: '100%', borderRadius: 20}
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    
  },[])
  

  return (
    <Box
      sx={{backgroundColor: '#f0f2f5', height:'100vh', width: '100%'}}
    >
      <Grid sx={{paddingTop: 5}}>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 40}}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Language"
              name={'language'}
              value={props.inputField['language']}
              onChange={props.handleChange}
            >
              <MenuItem value={'en'}>English</MenuItem>
              <MenuItem value={'fr'}>Français</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <ResponsiveCard>
        <Grid align='center' sx={{mt:5, mb: 4}}>
          <img src={config.url.file_url+props.org.logo} variant='square' width='50%'/>
        </Grid>
        {!props.resetPassword && <form onSubmit={props.handleSubmit}>
          <Box
            sx={{'& .MuiTextField-root': { m: 1, width: '35ch' }, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
            noValidate
            autoComplete="off"
          >
                <TextField
                  id="standard-error-helper-text"
                  label={props.literals?.email_address}
                  variant="standard"
                  type="email"
                  name="email"
                  value={props.inputField['email']}
                  onChange={props.handleChange}
                  required
                />
                <TextField
                  id="standard-password-input"
                  label={props.literals?.password}
                  type={(showPassword) ? 'text':'password'}
                  name="password"
                  autoComplete="current-password"
                  variant="standard"
                  value={props.inputField['password']}
                  onChange={props.handleChange}
                  InputProps={{ 
                    // pattern: "[a-zA-Z0-9]{6,12}",
                    // title: "Only numbers and alphabets are allowed",
                    endAdornment: <InputAdornment position="end">
                        <IconButton
                            onClick={()=>setShowPassword(!showPassword)}
                            edge="end"
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                  }}
                  required
                />
            <Grid sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: '78%',
              marginTop: '5%'
            }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="rememberMe"
                    color="primary"
                    size="small"
                    checked={props.inputField['rememberMe']}
                    onChange={props.handleChecked}
                  />
                }
                label={props.literals?.remember_me}
              />
              <Typography variant='body2'>
                <Link to={{pathname: router.reset}} style ={{color: theme.palette.primary.main}}>
                  {props.literals?.forgot_password} ?
                </Link>
              </Typography>
              <Button
                type="submit"
                color='primary'
                variant="contained"
                style={btnstyle}
              >
                {props.literals?.log_in}
              </Button>
            </Grid>
            <Typography fontSize='13px'>
              {props.literals?.dont_have_an_account}? <Link to={{pathname: router.signUp}} style ={{color: theme.palette.primary.main}}> {props.literals?.sign_up}</Link>
            </Typography>
            <Box sx={{ m: 2 }} />
          </Box>
        </form>}
        {props.resetPassword && <form onSubmit={props.handleChangePassword}>
          <Box
            sx={{'& .MuiTextField-root': { m: 1, width: '35ch' }, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-error-helper-text"
              label={props.literals?.new_password}
              variant="standard"
              type={(showPassword) ? 'text':'password'}
              name="new_password"
              value={props.inputField['new_password']}
              onChange={props.handleChange}
              InputProps={{ 
                // pattern: "[a-zA-Z0-9]{6,12}",
                // title: "Only numbers and alphabets are allowed",
                endAdornment: <InputAdornment position="end">
                    <IconButton
                        onClick={()=>setShowPassword(!showPassword)}
                        edge="end"
                    >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
              }}
              required
            />
            <Grid sx={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              width: '78%',
              marginTop: '5%'
            }}>
              <Button
                type="submit"
                color='primary'
                variant="contained"
                style={btnstyle}
              >
                {props.literals?.update_password}
              </Button>
            </Grid>
            <Typography fontSize='13px'>
              {props.literals?.dont_have_an_account}? <Link to={{pathname: router.signUp}} style ={{color: theme.palette.primary.main}}> {props.literals?.sign_up}</Link>
            </Typography>
            <Box sx={{ m: 2 }} />
          </Box>
        </form>}
        </ResponsiveCard>
      </Grid>
    </Box>
  );
}

export default LoginView;