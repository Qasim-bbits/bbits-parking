import React from "react";
import { Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";

const ReportTable = ({ data, groupByZone }) => (
  <Table>
    <TableHead>
      <TableRow>
        {groupByZone ? (
          <>
            <TableCell>Zone</TableCell>
            <TableCell>Total Parkings</TableCell>
            <TableCell>Unique Plates</TableCell>
            <TableCell>Total Amount</TableCell>
            <TableCell>Total Service Fee</TableCell>
          </>
        ) : (
          <>
            <TableCell>Zone</TableCell>
            <TableCell>Org</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Plate</TableCell>
            <TableCell>Amount</TableCell>
          </>
        )}
      </TableRow>
    </TableHead>
    <TableBody>
      {data.map((r, i) =>
        groupByZone ? (
          <TableRow key={i}>
            <TableCell>{r.zone_name}</TableCell>
            <TableCell>{r.total_parkings}</TableCell>
            <TableCell>{r.unique_plates}</TableCell>
            <TableCell>{r.total_amount}</TableCell>
            <TableCell>{r.total_service_fee}</TableCell>
          </TableRow>
        ) : (
          <TableRow key={i}>
            <TableCell>{r.zone_name}</TableCell>
            <TableCell>{r.org_name}</TableCell>
            <TableCell>{r.city_name}</TableCell>
            <TableCell>{r.plate}</TableCell>
            <TableCell>{r.amount}</TableCell>
          </TableRow>
        )
      )}
    </TableBody>
  </Table>
);

export default ReportTable;
