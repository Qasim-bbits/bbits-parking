import React from 'react';
import { Grid, Typography, useTheme } from '@mui/material';

export default function PrivacyPolicy(props) {
  const theme = useTheme();

  return (
    <Grid container spacing={2}>
      <Grid xs={12} className="p-4 text-center" sx={{background: theme.palette.primary.main}}>
        <Typography variant="h5" className="font-bold" sx={{color: '#fff'}}>
          {props.literals.privacy_policy}
        </Typography>
      </Grid>
      <Grid xs={12} className="mx-5 my-2">
        <Typography variant="subtitle1" className="font-bold m-2 font-gray" sx={{whiteSpace: 'pre-wrap'}}>
          {props.org.privacy_policy}
        </Typography>
      </Grid>
    </Grid>
  );
}