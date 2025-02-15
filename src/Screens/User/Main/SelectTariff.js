import React from 'react';
import Box from "@mui/material/Box";
import {Button, Checkbox, FormControlLabel, FormGroup, IconButton, Popover, Typography, useMediaQuery, useTheme} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import InfoIcon from '@mui/icons-material/Info';

function SelectTariff(props) {
  const theme = useTheme();
  const parkingRateButton = {
    backgroundColor: '#f0f2f5',
    margin: 5,
    color: theme.palette.primary.main,
  }
  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'), {
    defaultMatches: true,
    noSsr: false
  });

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };


  const open = Boolean(anchorEl);
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
        <Typography variant='h5' align='left' sx={{marginTop: 5, color: theme.palette.primary.main}} >
          <IconButton
            color="inherit"
            edge="start"
          >
            <LocalParkingIcon />
          </IconButton>
          {props.literals.select_rate}
        </Typography>
      </Box>
      {props.caption_en && <Box sx={{display: 'flex', width: '80%', mt: 2, justifyContent: 'space-between', alignItems: 'flex-end', color: 'black'}}>
        <FormGroup>
          <FormControlLabel control={
            <Checkbox
              name="select_caption"
              onChange={props.handleCheck}
              checked={props.inputField['select_caption']}
              required
            />} label={
              <Typography variant="subtitle1" color="primary" className="font-gray">
                {(props.literals.add == "Add") ? props.caption_en : props.caption_fr}
              </Typography>
            }/>
        </FormGroup>
      </Box>}
      <Box sx={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', marginTop: '2%', width: '80%'}}>
        {props.tarif.map(x=>{
          return(
            <Button variant='contained' onClick={()=>props.onTarifSelect(x)} style={parkingRateButton} fullWidth sx={{justifyContent: 'flex-start'}}
              disabled={
                (props.caption_en && !props.inputField['select_caption']) ? true : false
              }>
              <IconButton
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
                color="primary"
              >
                <InfoIcon />
              </IconButton>
              <Popover
                id="mouse-over-popover"
                sx={{
                  pointerEvents: 'none',
                }}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Typography sx={{ p: 1 }}>{x.rate_name}</Typography>
              </Popover>
              {x.rate_name}
            </Button>
          )
        })}
      </Box>
    </Box>
  );
}

export default SelectTariff;