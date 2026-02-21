import React from "react";
import { Breadcrumbs, Typography, Box, Tooltip } from "@mui/material";

const truncate = (text, max = 15) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
};

const TicketBreadcrumb = (props) => {
  const keys = [
    "org_name",
    "city_name",
    "zone_name",
    "plate",
    "ticket_name",
    "public_note",
    "private_note",
  ];

  const items = keys
    .map((key) => props.inputField?.[key])
    .filter(Boolean); // hide if not exist

  if (!items.length) return null;

  return (
    <Box
      sx={{
        width: "100%",
        overflowX: "auto",
        whiteSpace: "nowrap",
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#c1c1c1 !important",
          borderRadius: 8
        }
      }}
    >
      <Breadcrumbs separator="/" aria-label="breadcrumb" sx={{ flexWrap: "nowrap", minWidth: "max-content" }}>
        {items.map((item, index) => (
          <Tooltip key={index} title={item} arrow>
            <Typography
              variant="body2"
              sx={{
                maxWidth: 160,
                fontWeight: 500,
                cursor: "default",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {truncate(item, 15)}
            </Typography>
          </Tooltip>
        ))}
      </Breadcrumbs>
    </Box>
  );
};

export default TicketBreadcrumb;