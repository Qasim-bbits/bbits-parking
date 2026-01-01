// frontend/src/pages/Reports.js
import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Drawer,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    IconButton,
    Checkbox,
    FormControlLabel,
    Divider,
    Grid,
    useTheme,
    Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import FilterListIcon from "@mui/icons-material/FilterList";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Papa from "papaparse";
import SnackAlert from "../../../shared/SnackAlert";
import Spinner from "../../../shared/Spinner";
import { DeleteForeverOutlined } from "@mui/icons-material";
import { endpoints } from "../../../services/api-end-points";

export default function Reports(props) {
    const theme = useTheme();

    const [spinner, setSpinner] = useState(false);
    const [msg, setMsg] = useState('');
    const [alert, setAlert] = useState(false);
    const [severity, setSeverity] = useState('');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [filters, setFilters] = useState([]); // each: { key, type, operator, value }
    const [logic, setLogic] = useState("AND");
    const [groupByZone, setGroupByZone] = useState(false);
    const [data, setData] = useState([]);
    const [totals, setTotals] = useState({});
    const [lookups, setLookups] = useState({ orgs: [], cities: [], zones: [] });

    // field definitions
    const fieldDefs = [
        { key: "org", label: "Organization", type: "dropdown" },
        { key: "city", label: "City", type: "dropdown" },
        { key: "zone", label: "Zone", type: "dropdown" },
        { key: "plate", label: "Plate", type: "string" },
        { key: "ticket", label: "Ticket", type: "string" },
        { key: "paymentMethod", label: "Payment Method", type: "string" },
        { key: "email", label: "Email", type: "string" },
        { key: "amount", label: "Amount", type: "number" },
        { key: "parking_id", label: "Parking ID", type: "number" },
        // date/time separate fields (act like other fields)
        { key: "transactionDate", label: "Transaction (date)", type: "date" },
        { key: "fromDate", label: "From (date)", type: "date" },
        { key: "toDate", label: "To (date)", type: "date" },
        { key: "transactionTime", label: "Transaction (time)", type: "time" },
        { key: "fromTime", label: "From (time)", type: "time" },
        { key: "toTime", label: "To (time)", type: "time" },
    ];

    useEffect(() => {
        async function loadLookups() {
            try {
                const res = await fetch(endpoints.reporting.lookups);
                const json = await res.json();
                if (json && json.success) setLookups(json.data || {});
            } catch (e) {
                console.error("lookups load error", e);
            }
        }
        loadLookups();
    }, []);

    function addFilterRow() {
        setFilters([...filters, { key: "", type: "string", operator: "", value: "" }]);
    }
    function removeFilterRow(i) {
        const copy = [...filters];
        copy.splice(i, 1);
        setFilters(copy);
    }
    function updateFilter(i, key, value) {
        const copy = [...filters];
        copy[i] = { ...copy[i], [key]: value };
        // auto update type when selecting field
        if (key === "key") {
            const def = fieldDefs.find((d) => d.key === value);
            copy[i].type = def ? def.type : "string";
            copy[i].operator = "";
            copy[i].value = "";
        }
        setFilters(copy);
    }

    function operatorsForType(t) {
        if (t === "dropdown") return [
            { value: "eq", label: "Equal" },
            { value: "ne", label: "Not equal" },
        ];
        if (t === "string") return [
            { value: "contains", label: "Contains" },
            { value: "notcontains", label: "Not contains" },
            { value: "eq", label: "Equal" },
            { value: "ne", label: "Not equal" },
        ];
        if (t === "number") return [
            { value: "gte", label: "≥" },
            { value: "lte", label: "≤" },
            { value: "eq", label: "=" },
            { value: "ne", label: "≠" },
        ];
        if (t === "date") return [
            { value: "eq", label: "Equal (day)" },
            { value: "gte", label: "After or equal" },
            { value: "lte", label: "Before or equal" },
        ];
        if (t === "time") return [
            { value: "eq", label: "Equal (HH:mm)" },
            { value: "gte", label: "After or equal (time)" },
            { value: "lte", label: "Before or equal (time)" },
        ];
        return [{ value: "eq", label: "Equal" }];
    }

    async function applyFilters() {
        // build payload: include logic, groupByZone, filters
        // ensure date fields send YYYY-MM-DD, time fields send HH:mm
        const payloadFilters = (filters || [])
            .filter((f) => f.key && f.operator && (f.value !== undefined && f.value !== ""))
            .map((f) => {
                let value = f.value;
                if (f.type === "date") {
                    // accept Date input value like "2025-10-01"
                    value = value;
                }
                if (f.type === "time") {
                    // accept "HH:mm" from input[type=time]
                    value = value;
                }
                return { key: f.key, type: f.type, operator: f.operator, value };
            });

        const payload = {
            logic,
            groupByZone,
            filters: payloadFilters,
        };

        try {
            setSpinner(true);
            const res = await fetch(endpoints.reporting.reports_v2, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const json = await res.json();
            if (json && json.success) {
                setData(json.data || []);
                setTotals(json.totals || {});
            } else {
                setData([]);
                setTotals({});
            }
        } catch (e) {
            setMsg(e);
            setSeverity('error');
            setAlert(true);
            setData([]);
            setTotals({});
        } finally {
            setSpinner(false);
            setOpenDrawer(false);
        }
    }

    function exportCSV() {
        if (!data || !data.length) {
            setMsg(props.literals.no_record_found);
            setSeverity('error');
            setAlert(true);
            return;
        }
        const formattedData = data.map(
            ({
                _id,
                parking_id,
                org_name,
                city_name,
                zone_name,
                plate,
                transaction_date,
                from,
                to,
                amount,
                service_fee,
            }) => ({
                "Parking ID": parking_id,
                Org: org_name,
                City: city_name,
                Zone: zone_name,
                Plate: plate,
                "Transaction Date": transaction_date,
                From: from,
                To: to,
                Amount: `$ ${(amount / 100).toFixed(2)}`,
                "Service Fee": `$ ${(service_fee / 100).toFixed(2)}`,
            })
        );

        const csv = Papa.unparse(formattedData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `parking-report-${groupByZone ? "zone" : "detailed"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function exportPDF() {
        if (!data || !data.length) {
            setMsg(props.literals.no_record_found);
            setSeverity('error');
            setAlert(true);
            return;
        }
        const doc = new jsPDF("landscape");
        const head = groupByZone
            ? [["Zone", "Parkings", "Unique Plates", "Total Amount", "Service Fee"]]
            : [["Parking ID", "Org", "City", "Zone", "Plate", "Transaction Date", "From", "To", "Amount", "Service Fee"]];
        const body = data.map((r) => {
            if (groupByZone) return [r.zone_name || "", r.totalParkings || 0, r.uniquePlatesCount || 0, r.totalAmount || 0, r.totalServiceFee || 0];
            return [r.parking_id || "", r.org_name || "", r.city_name || "", r.zone_name || "", r.plate || "", r.transaction_date || "", r.from || "", r.to || "", '$ ' + (r.amount / 100).toFixed(2), '$ ' + (r.service_fee / 100).toFixed(2)];
        });
        doc.autoTable({ head, body, startY: 14 });
        doc.save(`parking-report-${groupByZone ? "zone" : "detailed"}.pdf`);
    }

    // Columns include from/to and org_name/city_name/zone_name
    const columns = groupByZone ? [
        { field: "zone_name", headerName: "Zone", flex: 1 },
        { field: "totalParkings", headerName: "Parkings", flex: 1 },
        { field: "uniquePlatesCount", headerName: "Unique Plates", flex: 1 },
        { field: "totalAmount", headerName: "Total Amount", flex: 1, valueGetter: (params) => '$ ' + (params.row?.totalAmount / 100).toFixed(2) },
        { field: "totalServiceFee", headerName: "Service Fee", flex: 1, valueGetter: (params) => '$ ' + (params.row?.totalServiceFee / 100).toFixed(2) },
    ] : [
        { field: "parking_id", headerName: "Parking ID", flex: 1 },
        { field: "org_name", headerName: "Organization", flex: 1 },
        { field: "city_name", headerName: "Location", flex: 1, valueGetter: (params) => params.row?.zone_name + ', ' + params.row?.city_name },
        { field: "plate", headerName: "Plate", flex: 1 },
        { field: "transaction_date", headerName: "Transactino Date", flex: 1 },
        { field: "from", headerName: "From", flex: 1 },
        { field: "to", headerName: "To", flex: 1 },
        { field: "amount", headerName: "Amount", flex: 1, valueGetter: (params) => '$ ' + (params.row?.amount / 100).toFixed(2) },
        { field: "service_fee", headerName: "Service Fee", flex: 1, valueGetter: (params) => '$ ' + (params.row?.service_fee / 100).toFixed(2) },
    ];

    return (
        <Box sx={{ p: 2 }}>
            <Grid container sx={{ mb: 2 }} alignItems="center">
                <Grid item xs={12} sm={12} md={8} lg={8}>
                    <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Parkings Reports</Typography>
                    <Box>
                        <Button variant="contained" startIcon={<FilterListIcon />} onClick={() => setOpenDrawer(true)}>Filters</Button>
                        <Button sx={{ ml: 2 }} variant="outlined" onClick={exportCSV}>Export CSV</Button>
                        <Button sx={{ ml: 2 }} variant="outlined" onClick={exportPDF}>Export PDF</Button>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} align="right">
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Grid container spacing={1} textAlign="start">
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" sx={{ color: '#696969' }}>Total Parkings</Typography>
                            </Grid>
                            <Grid item xs={6} align="right">
                                <Typography variant="subtitle2" sx={{ color: '#696969' }}>{totals.totalParkings || 0}</Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="subtitle2" sx={{ color: '#696969' }}>Plates</Typography>
                            </Grid>
                            <Grid item xs={6} align="right">
                                <Typography variant="subtitle2" sx={{ color: '#696969' }}>{totals.uniquePlates || 0}</Typography>
                            </Grid>

                            <Grid item xs={6}>
                                <Typography variant="subtitle2" sx={{ color: '#696969' }}>Total Service Fee</Typography>
                            </Grid>
                            <Grid item xs={6} align="right">
                                <Typography variant="subtitle2" sx={{ color: '#696969' }}>{totals.totalServiceFee ? '$ ' + (totals.totalServiceFee / 100).toFixed(2) : 0}</Typography>
                            </Grid>
                            <Grid item xs={12}><Divider /></Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle2" className="font-bold">Total Amount</Typography>
                            </Grid>
                            <Grid item xs={6} align="right">
                                <Typography variant="subtitle2" className="font-bold">{totals.totalAmount ? '$ ' + (totals.totalAmount / 100).toFixed(2) : 0}</Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>

            <Box sx={{
                height: '75vh',
                width: '100%',
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: theme.palette.primary.main,
                    color: '#fff'
                },
            }}>
                <DataGrid
                    density={'compact'}
                    autoHeight
                    rows={(data || []).map((r, i) => ({ id: i, ...r }))}
                    columns={columns}
                    loading={spinner}
                    disableSelectionOnClick
                />
            </Box>
            <Drawer PaperProps={{
                sx: {
                    backgroundColor: "#fff !important",
                    width:
                        window.innerWidth > 700
                            ? "40% !important"
                            : "100% !important",
                },
            }} anchor="right" open={openDrawer} onClose={() => setOpenDrawer(false)}>
                <Box sx={{
                    width: '100% !important',
                    p: 2
                }}>
                    <Typography variant="h6">Filters</Typography>
                    <Divider sx={{ my: 1 }} />

                    {filters.map((f, i) => {
                        const def = fieldDefs.find(d => d.key === f.key) || {};
                        const type = f.type || def.type || "string";
                        return (
                            <Box key={i} sx={{ mb: 2 }}>
                                <Box sx={{ display: "flex", gap: 1 }}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Field</InputLabel>
                                        <Select value={f.key || ""} label="Field" onChange={(e) => updateFilter(i, "key", e.target.value)}>
                                            {fieldDefs.map(fd => <MenuItem key={fd.key} value={fd.key}>{fd.label}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth size="small">
                                        <InputLabel>Operator</InputLabel>
                                        <Select value={f.operator || ""} label="Operator" onChange={(e) => updateFilter(i, "operator", e.target.value)}>
                                            {operatorsForType(type).map(op => <MenuItem key={op.value} value={op.value}>{op.label}</MenuItem>)}
                                        </Select>
                                    </FormControl>

                                    <IconButton color="error" onClick={() => removeFilterRow(i)} aria-label="remove">
                                        <DeleteForeverOutlined />
                                    </IconButton>
                                </Box>

                                <Box sx={{ mt: 1 }}>
                                    {/* value input depending on type */}
                                    {type === "dropdown" ? (
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Value</InputLabel>
                                            <Select value={f.value || ""} label="Value" onChange={(e) => updateFilter(i, "value", e.target.value)}>
                                                {(f.key === "org" ? lookups.orgs : f.key === "city" ? lookups.cities : lookups.zones || []).map(opt => (
                                                    <MenuItem key={opt._id} value={opt._id}>{opt.org_name || opt.city_name || opt.zone_name || opt.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : type === "number" ? (
                                        <TextField label={'Value'} fullWidth size="small" type="number" value={f.value || ""} onChange={(e) => updateFilter(i, "value", e.target.value)} />
                                    ) : type === "date" ? (
                                        <TextField label={'Select Date'} fullWidth size="small" type="date" value={f.value || ""} onChange={(e) => updateFilter(i, "value", e.target.value)} InputLabelProps={{ shrink: true }} />
                                    ) : type === "time" ? (
                                        <TextField label={'Select Time'} fullWidth size="small" type="time" value={f.value || ""} onChange={(e) => updateFilter(i, "value", e.target.value)} InputLabelProps={{ shrink: true }} />
                                    ) : (
                                        <TextField label={'Value'} fullWidth size="small" value={f.value || ""} onChange={(e) => updateFilter(i, "value", e.target.value)} />
                                    )}
                                </Box>
                            </Box>
                        );
                    })}

                    <Button fullWidth variant="outlined" onClick={addFilterRow}>+ Add Filter</Button>

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <FormControl sx={{ flex: 1 }} size="small">
                            <InputLabel>Logic</InputLabel>
                            <Select value={logic} label="Logic" onChange={(e) => setLogic(e.target.value)}>
                                <MenuItem value="AND">AND</MenuItem>
                                <MenuItem value="OR">OR</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControlLabel sx={{ color: theme.palette.primary.main, flex: 1 }} control={<Checkbox checked={groupByZone} onChange={(e) => setGroupByZone(e.target.checked)} />} label="Group by Zone" />
                    </Box>

                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button variant="contained" fullWidth onClick={applyFilters}>Apply</Button>
                        <Button variant="outlined" fullWidth onClick={() => { setFilters([]); setTotals({}); setData([]); }}>Reset</Button>
                        <Button variant="outlined" fullWidth onClick={() => { setOpenDrawer(false) }}>Close</Button>
                    </Box>
                </Box>
            </Drawer>
            <SnackAlert
                msg={msg}
                alert={alert}
                severity={severity}

                closeAlert={() => setAlert(!alert)}
            />
            <Spinner
                spinner={spinner}
            />
        </Box>
    );
}
