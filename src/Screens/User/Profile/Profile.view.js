import React from 'react';
import {Button, Grid, Typography, TextField, Paper} from "@mui/material";

function ProfileView(props) {
  console.log(props)
  return (
    <Paper elevation={2} sx={{ width: '100%',p: 3, height: '80vh' }}>
        <Typography variant="h6" color="primary">
          {props.literals.profile}
        </Typography>
        <form onSubmit={props.handleSubmit}>
          <Grid container spacing={2} sx={{mt:2}}>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <TextField
                label={props.literals.first_name}
                color="primary"
                type="text"
                name="fname"
                value={props.inputField["fname"]}
                onChange={props.handleChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <TextField
                label={props.literals.last_name}
                color="primary"
                type="text"
                name="lname"
                value={props.inputField["lname"]}
                onChange={props.handleChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <TextField
                label={props.literals.phone_no}
                color="primary"
                type="number"
                name="mobile_no"
                value={props.inputField["mobile_no"]}
                onChange={props.handleChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <TextField
                label={props.literals.address}
                color="primary"
                type="text"
                name="address"
                value={props.inputField["address"]}
                onChange={props.handleChange}
                size="small"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <TextField
                label={props.literals.email}
                color="primary"
                type="email"
                name="email"
                value={props.inputField["email"]}
                onChange={props.handleChange}
                size="small"
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} alignSelf={"center"}>
              <TextField
                label={props.literals.password}
                color="primary"
                type="password"
                name="password"
                value={props.inputField["password"]}
                onChange={props.handleChange}
                size="small"
                required
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}alignSelf={"center"}>
              <Button type="submit" color="primary" variant="contained">
                {props.literals.update}
              </Button>
            </Grid>
          </Grid>
        </form>
    </Paper>
        
  );
}

export default ProfileView;