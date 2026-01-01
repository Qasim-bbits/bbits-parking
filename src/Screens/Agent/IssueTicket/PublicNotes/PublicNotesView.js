import React from 'react';
import { Divider, List, ListItem, ListItemText, ListItemButton, TextField, Typography, ListItemIcon, useTheme, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Done } from '@mui/icons-material';

export default function PublicNotesView(props) {
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
            {props.inputField.enable_custom_public_notes && <Grid item xs={12} sx={{ p: 2 }}>
                <TextField
                    label={props.literals?.custom_public_note}
                    variant="outlined"
                    type="text"
                    value={props.inputField.public_note}
                    onChange={(e) => props.onChange({ public_note: e.target.value })}
                    fullWidth
                />
            </Grid>}
            <Grid item xs={12}>
                {!props.publicNotes.length &&
                    <Typography variant="subtitle1" color="secondary" sx={{ textAlign: 'center' }}>{props.literals.no_record_found}</Typography>
                }
                <List>
                    {props.publicNotes.map(x => {
                        return (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ color: props.inputField.public_note == x.note && theme.palette.primary.main }} onClick={() => props.onChange({ public_note: x.note })}>
                                        {props.inputField.public_note == x.note && <ListItemIcon>
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