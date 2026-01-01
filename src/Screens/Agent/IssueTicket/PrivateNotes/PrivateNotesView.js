import React from 'react';
import { Divider, List, ListItem, ListItemText, ListItemButton, TextField, Typography, ListItemIcon, useTheme, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Done } from '@mui/icons-material';

export default function PrivateNotesView(props) {
    let theme = useTheme();

    return (
        <Grid container>
            <Grid item xs={12} sx={{ p: 2 }}>
                <TextField
                    label={props.literals?.search}
                    variant="outlined"
                    type="text"
                    onChange={props.handleSearch}
                    fullWidth
                />
            </Grid>
            {props.inputField.enable_custom_private_notes && <Grid item xs={12} sx={{ p: 2 }}>
                <TextField
                    label={props.literals?.custom_private_note}
                    variant="outlined"
                    type="text"
                    value={props.inputField.private_note}
                    onChange={(e) => props.onChange({ private_note: e.target.value })}
                    fullWidth
                />
            </Grid>}
            <Grid item xs={12}>
                {!props.privateNotes.length &&
                    <Typography variant="subtitle1" color="secondary" sx={{ textAlign: 'center' }}>{props.literals.no_record_found}</Typography>
                }
                <List>
                    {props.privateNotes.map(x => {
                        return (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ color: props.inputField.private_note == x.note && theme.palette.primary.main }} onClick={() => props.onChange({ private_note: x.note })}>
                                        {props.inputField.private_note == x.note && <ListItemIcon>
                                            <Done color="primary" />
                                        </ListItemIcon>}
                                        <ListItemText primary={x.note} />
                                    </ListItemButton>

                                </ListItem>
                                <Divider />
                            </>
                        )
                    })}
                </List>
            </Grid>
        </Grid>
    );
}