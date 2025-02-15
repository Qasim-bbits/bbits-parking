import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid, InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";
import logo from "../../../assets/images/Logos/logo.svg";
import ResponsiveCard from "../../User/ResponsiveCard";
import { router } from '../../../Routes/routhPaths';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTheme } from '@mui/styles';
import { config } from '../../../Constants';
import InputMask from 'react-input-mask';

function SignUpView(props) {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const btnstyle={margin:'8% 0', width: '100%', borderRadius: 20}

  return (
    <Box
      sx={{backgroundColor: '#f0f2f5', height:'100%', width: '100%'}}
    >
      <Grid sx={{paddingTop: 5}}>
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: 40}}>
          <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-standard-label">Language</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              label="Language"
              name="language"
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
            <Avatar src={config.url.file_url+props.org.logo} variant='square' sx={{width: 220, height: 70}} />
          </Grid>
        <form onSubmit={props.handleSubmit}>
          <Box
            sx={{'& .MuiTextField-root': { m: 1, width: '35ch' }, display: 'flex', flexDirection: 'column', alignItems: 'center'}}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="standard-error-helper-text"
              label={props.literals.first_name}
              fullWidth
              variant="standard"
              type="text"
              name="fname"
              value={props.inputField['fname']}
              onChange={props.handleChange}
              required
            />
            <TextField
              id="standard-error-helper-text"
              label={props.literals.last_name}
              fullWidth
              variant="standard"
              type="text"
              name="lname"
              value={props.inputField['lname']}
              onChange={props.handleChange}
              required
            />
            <TextField
              id="standard-error-helper-text"
              label={props.literals.address}
              fullWidth
              variant="standard"
              type="text"
              name="address"
              value={props.inputField['address']}
              onChange={props.handleChange}
            />
            <InputMask
                mask="+1 (999) 999-9999"
                maskChar=""
                value={props.inputField['mobile_no']}
                onChange={props.handleChange}
            >
              {() => <TextField
                label={props.literals.phone_no}
                color="primary"
                variant="standard"
                name="mobile_no"
                fullWidth
              />}
            </InputMask>
            <TextField
              id="standard-error-helper-text"
              label={props.literals.email_address}
              fullWidth
              variant="standard"
              type="email"
              name="email"
              value={props.inputField['email']}
              onChange={props.handleChange}
              required
            />
            <TextField
              id="standard-password-input"
              label={props.literals.password}
              fullWidth
              name="password"
              type={(showPassword) ? 'text':'password'}
              autoComplete="current-password"
              variant="standard"
              onChange={props.handleChange}
              value={props.inputField['password']}
              InputProps={{ 
                // pattern: /^[a-zA-Z0-9]*$/,
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
                    name="accept_conditions"
                    color="primary"
                    onChange={props.handleCheck}
                    value={props.inputField['accept_conditions']}
                    required
                  />
                }
                label={
                  <Typography variant='caption' sx={{letterSpacing: 0.1}}>
                    I have read and agreed to the
                    <Link to={{pathname: router.conditionOfUse}} style ={{color: theme.palette.primary.main, textDecoration: 'none'}}> Conditions of Use </Link>
                    and the
                    <Link to={{pathname: router.privacyPolicy}} style ={{color: theme.palette.primary.main, textDecoration: 'none'}}> Privacy Policy</Link>.
                  </Typography>
                }
              />
              <Box sx={{ m: 2 }} />
              <Button
                type='submit'
                color='primary'
                variant="contained"
                style={btnstyle}
                size='large'
              >
                {props.literals.sign_up}
              </Button>
            </Grid>
            <Typography fontSize='13px'>
              {props.literals.already_a_member}? <Link to={{pathname: router.login}} style ={{color: theme.palette.primary.main}}>{props.literals.log_in}</Link>
            </Typography>
            <Box sx={{ m: 2 }} />
          </Box>
        </form>
        </ResponsiveCard>
      </Grid>
    </Box>
  );
}

export default SignUpView;