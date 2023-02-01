import React from "react";
import {Grid, Paper, useTheme} from "@mui/material";
import SmallCard from "../../../components/SmallCard";
import ParkIn from "../../../assets/icons/park_in.png"
import Amount from "../../../assets/icons/amount.png"
import List from "../../../assets/icons/list.png"
import Clock from "../../../assets/icons/clock.png"
import {router} from "../../../Routes/routhPaths";
import AreaRechart from "../../../components/Charts/AreaChart";

export default function DashboardView(props) {
  const theme = useTheme();
  return (
    <Grid container spacing={2} sx={{ justifyContent: "center" }}>
      <Grid item md={3} xs={12} lg={3}>
        <SmallCard
          imageFilename={ParkIn}
          heading={props.literals.current}
          caption={props.literals.parking}
          quantity={props.dashboard.current}
          path={router.parkings+"/current"}
        />
      </Grid>
      <Grid item md={3} xs={12} lg={3}>
        <SmallCard
          imageFilename={Clock}
          heading={props.literals.historical}
          caption={props.literals.parking}
          quantity={props.dashboard.all}
          path={router.parkings+"/all"}
        />
      </Grid>
      <Grid item md={3} xs={12} lg={3}>
        <SmallCard
          imageFilename={Amount}
          heading={props.literals.paid}
          caption={props.literals.parking}
          quantity={props.dashboard.paid}
          path={router.parkings+"/paid"}
        />
      </Grid>
      <Grid item md={3} xs={12} lg={3}>
        <SmallCard
          imageFilename={List}
          heading={props.literals.free}
          caption={props.literals.parking}
          quantity={props.dashboard.free}
          path={router.parkings+"/free"}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3} sx={{ height: "80vh", p: 2, mb: 8 }}>
          <AreaRechart
              titleColor = {'primary'}
              title = {props.literals.report}
              height = {400}
              data = {props.dashboard.assetsReport}
              xDataKey = {"_id"}
              yDataKey = {"Amount"}
              stroke = {theme.palette.primary.main}
              fill = {theme.palette.primary.main}
              literals = {props.literals}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
