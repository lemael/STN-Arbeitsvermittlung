import React from "react";

import { Grid } from "@mui/material";
import { PlaceHolder } from "./SubComponents/PlaceHolder";
import { ListVonSubunternehmer } from "./SubComponents/ListVonSubunternehmer";
export default function ApplicationsHomeDashboard(): React.JSX.Element {
  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <PlaceHolder height={100} />
      </Grid>
      <Grid size={6}>
        <PlaceHolder height={100} />
      </Grid>
      <Grid size={12}>
        <ListVonSubunternehmer height={200} />
      </Grid>
    </Grid>
  );
}
