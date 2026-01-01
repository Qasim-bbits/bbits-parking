// ReportDrawer.js
import React from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Divider,
  Select,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

/**
 * Props:
 *  open, onClose,
 *  filters, setFilters,
 *  logic, setLogic,
 *  groupByZone, setGroupByZone,
 *  lookups,
 *  startDate, setStartDate, endDate, setEndDate,
 *  startTime, setStartTime, endTime, setEndTime,
 *  onApply
 */
const fieldMeta = [
  { key: "org", label: "Organization", type: "dropdown" },
  { key: "city", label: "City", type: "dropdown" },
  { key: "zone", label: "Zone", type: "dropdown" },
  { key: "user", label: "User", type: "dropdown" },
  { key: "rate", label: "Rate", type: "dropdown" },
  { key: "plate", label: "Plate", type: "string" },
  { key: "ticket", label: "Ticket", type: "string" },
  { key: "paymentMethod", label: "Payment Method", type: "string" },
  { key: "email", label: "Email", type: "string" },
  { key: "amount", label: "Amount", type: "number" },
  { key: "parking_id", label: "Parking ID", type: "number" },
  { key: "from", label: "From (date)", type: "date" },
  { key: "to", label: "To (date)", type: "date" },
];

function operatorsForType(type) {
  if (type === "string")
    return [
      { key: "contains", label: "Contains" },
      { key: "equal", label: "Equal" },
      { key: "not_equal", label: "Not equal" },
      { key: "not_contains", label: "Not contains" },
    ];
  if (type === "number")
    return [
      { key: "greater_or_equal", label: "≥" },
      { key: "less_or_equal", label: "≤" },
      { key: "equal", label: "=" },
      { key: "not_equal", label: "≠" },
    ];
  if (type === "dropdown")
    return [
      { key: "equal", label: "Equal" },
      { key: "not_equal", label: "Not equal" },
    ];
  if (type === "date")
    return [
      { key: "equal", label: "Equal (single day)" },
      { key: "greater_or_equal", label: "After or equal" },
      { key: "less_or_equal", label: "Before or equal" },
    ];
  return [{ key: "equal", label: "Equal" }];
}

export default function ReportDrawer(props) {
  const {
    filters,
    setFilters,
    logic,
    setLogic,
    groupByZone,
    setGroupByZone,
    lookups,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    onApply,
    onClose,
  } = props;

  function addFilterRow() {
    setFilters([...filters, { key: "", type: "string", operator: "", value: "" }]);
  }

  function updateFilter(i, key, value) {
    const copy = filters.slice();
    copy[i] = Object.assign({}, copy[i], { [key]: value });
    // auto-set type when field is selected
    if (key === "key") {
      const meta = fieldMeta.find((f) => f.key === value);
      copy[i].type = meta ? meta.type : "string";
      copy[i].operator = "";
      copy[i].value = "";
    }
    setFilters(copy);
  }

  function removeFilter(i) {
    const copy = filters.slice();
    copy.splice(i, 1);
    setFilters(copy);
  }

  function renderValueInput(f, i) {
    if (f.type === "dropdown") {
      const options =
        f.key === "org"
          ? lookups.orgs || []
          : f.key === "city"
          ? lookups.cities || []
          : f.key === "zone"
          ? lookups.zones || []
          : f.key === "user"
          ? lookups.users || []
          : f.key === "rate"
          ? lookups.rates || []
          : [];
      return (
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <InputLabel>Value</InputLabel>
          <Select
            value={f.value || ""}
            label="Value"
            onChange={(e) => updateFilter(i, "value", e.target.value)}
          >
            {options.map((o) => (
              <MenuItem key={o._id} value={o._id}>
                {o.name || o.email || o.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );
    }

    if (f.type === "number") {
      return (
        <TextField
          fullWidth
          size="small"
          type="number"
          value={f.value || ""}
          onChange={(e) => updateFilter(i, "value", e.target.value)}
          sx={{ mt: 1 }}
        />
      );
    }

    if (f.type === "date") {
      // for per-field date: allow entering a single date (or used top-level date/time if preferred)
      return (
        <TextField
          fullWidth
          size="small"
          type="date"
          value={f.value || ""}
          onChange={(e) => updateFilter(i, "value", e.target.value)}
          sx={{ mt: 1 }}
        />
      );
    }

    // default string input
    return (
      <TextField
        fullWidth
        size="small"
        value={f.value || ""}
        onChange={(e) => updateFilter(i, "value", e.target.value)}
        sx={{ mt: 1 }}
      />
    );
  }

  return (
    <Box sx={{ width: 380, p: 2 }}>
      <Typography variant="h6">Filters</Typography>
      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Logic</InputLabel>
          <Select value={logic} label="Logic" onChange={(e) => setLogic(e.target.value)}>
            <MenuItem value="AND">AND</MenuItem>
            <MenuItem value="OR">OR</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel>Group</InputLabel>
          <Select
            value={groupByZone ? "zone" : ""}
            label="Group"
            onChange={(e) => setGroupByZone(e.target.value === "zone")}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="zone">Zone</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="subtitle2" sx={{ mt: 1 }}>
        Date & Time (separate)
      </Typography>
      <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
        <TextField
          label="Start Date"
          type="date"
          size="small"
          value={startDate || ""}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          size="small"
          value={endDate || ""}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          label="Start Time"
          type="time"
          size="small"
          value={startTime || ""}
          onChange={(e) => setStartTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Time"
          type="time"
          size="small"
          value={endTime || ""}
          onChange={(e) => setEndTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      <Divider sx={{ my: 1 }} />

      {filters.map((f, i) => (
        <Box key={i} sx={{ mb: 1, borderBottom: "1px solid #eee", pb: 1 }}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Field</InputLabel>
              <Select
                value={f.key || ""}
                label="Field"
                onChange={(e) => updateFilter(i, "key", e.target.value)}
              >
                {fieldMeta.map((m) => (
                  <MenuItem key={m.key} value={m.key}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth size="small">
              <InputLabel>Operator</InputLabel>
              <Select
                value={f.operator || ""}
                label="Operator"
                onChange={(e) => updateFilter(i, "operator", e.target.value)}
              >
                {(operatorsForType(f.type || "string") || []).map((op) => (
                  <MenuItem key={op.key} value={op.key}>
                    {op.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <IconButton color="error" onClick={() => removeFilter(i)} sx={{ alignSelf: "center" }}>
              <DeleteIcon />
            </IconButton>
          </Box>

          {renderValueInput(f, i)}
        </Box>
      ))}

      <Button variant="outlined" fullWidth onClick={addFilterRow} sx={{ mt: 1 }}>
        + Add Filter
      </Button>

      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        <Button variant="contained" fullWidth onClick={onApply}>
          Apply
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose}>
          Close
        </Button>
      </Box>
    </Box>
  );
}
