import React from 'react';
import Box from "@mui/material/Box";
import {Button, IconButton, Typography, Paper, useMediaQuery, ListItem, Divider, useTheme} from "@mui/material";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function SelectPlateForm(props) {
  const theme = useTheme();
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
      background: '#fff',
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
            <DirectionsCarIcon />
          </IconButton>
          {props.literals.select_plate}
        </Typography>
      </Box>
      <Box sx={{width: '80%', textAlign: 'end'}}>
        <Button size='large' variant='contained' onClick={props.addPlateDrawer}>
          {props.literals.add_plate}
        </Button>
      </Box>
      <Box sx={{width: '100%', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' ,marginTop: '10%', padding: '0 1% 0 1%'}}>
        {props.plates.map((x) => (
          <Paper elevation={1} sx={{display: 'flex', height: 120, width: '80%', backgroundColor:'#f0f2f5', marginBottom: '5px'}}>
            <ListItem>
              <Box
                sx={{display: 'flex', flexDirection: 'column', borderRight: '2px solid #b5b5b7'}}
              >
              <IconButton
                color="primary"
                edge="start"
                onClick={()=>props.onPlateEdit(x)}
              >
                <EditIcon />
              </IconButton>
                <Divider
                  variant='fullWidth'
                  sx={{width: '100%', backgroundColor: '#b5b5b7', borderBottomWidth: 2}}

                />
              <IconButton
                color="primary"
                edge="start"
                onClick={()=>props.onPlateDel(x._id)}
              >
                <DeleteIcon />
              </IconButton>
              </Box>
              <ListItem
                onClick={()=>props.onPlateSelect(x.plate)}
                sx={{cursor: 'pointer'}}
              >
                <Typography variant='h5' sx={{marginLeft: '10%', color: theme.palette.primary.main}}>
                  {x.plate}
                </Typography>
              </ListItem>
            </ListItem>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default SelectPlateForm;