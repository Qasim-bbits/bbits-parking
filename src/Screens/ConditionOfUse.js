import React from 'react';
import { Grid, Typography, useTheme } from '@mui/material';

export default function ConditionOfUse(props) {
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid xs={12} className="p-4 text-center" sx={{background: theme.palette.primary.main}}>
        <Typography variant="h5" className="font-bold" sx={{color: '#fff'}}>
          {props.literals.condition_of_use}
        </Typography>
      </Grid>
      <Grid xs={12} className="mx-5 my-2">
        <Typography variant="subtitle1" className="font-bold font-gray" sx={{whiteSpace: 'pre-wrap'}}>
          {props.org.condition_of_use}
        </Typography>
      </Grid>
    </Grid>
  );
}