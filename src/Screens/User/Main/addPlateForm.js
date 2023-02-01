import React from 'react';
import Box from "@mui/material/Box";
import {Button, IconButton, TextField, Typography, useMediaQuery, useTheme} from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function AddPlateForm(props) {
  const theme = useTheme();
  const btnstyle={margin:'8% 0', width: '100%', borderRadius: 20}

  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'), {
    defaultMatches: true,
    noSsr: false
  });

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: smDown ? '100vw' : 600,
      backgroundColor: '#fff',
      height: '100%'
    }}>
      <Box sx={{display: 'flex', backgroundColor: theme.palette.primary.main, width: '100%'}}>
        <IconButton
          color="inherit"
          edge="end"
          onClick={props.back}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>
      <Box sx={{display: 'flex', width: '80%', justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
        <Typography variant='h5' align='left' sx={{marginTop: 5, color: 'primary.main'}} >
          <IconButton
            color="inherit"
            edge="start"
          >
            <DirectionsCarIcon />
          </IconButton>
          {props.btn}
        </Typography>
      </Box>
      <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '10%', padding: '0 8% 0 8%'}}>
        <Typography variant= 'body1' color='primary' marginBottom='5%'>
          {props.literals.add_many_cars}
        </Typography>
        <form onSubmit = {props.handlePlateSubmit} style={{width: '100%'}}>
          <TextField
            id="standard-error-helper-text"
            label={props.literals.new_plate}
            type="text"
            color='primary'
            size="small"
            name="plate"
            value={props.inputPlateField["plate"]}
            onChange={props.handlePlateChange}
            required
            fullWidth
          />
          <Button style={btnstyle} type="submit" color="primary" variant='contained'>
            {props.btn}
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default AddPlateForm;