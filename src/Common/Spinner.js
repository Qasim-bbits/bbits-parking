import React from "react";
import { Box, Backdrop, CircularProgress, useTheme } from "@mui/material";
import { styled } from '@mui/material/styles';

const useStyles = styled((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

function Spinner(props){
  const theme = useTheme();
  const classes = useStyles();

  return(
    <>
      <Backdrop className={classes.backdrop} open={props.spinner}>
        <Box position="relative" display="inline-flex">
          <CircularProgress sx={{color: theme.palette.primary.main}}/>
        </Box>
      </Backdrop>
    </>
  )
}

export default Spinner;