import React from 'react';
import { Divider, List, ListItem, ListItemText, ListItemButton, TextField, Typography, ListItemIcon, useTheme } from '@mui/material';
import Grid from '@mui/material/Grid';
import { Done } from '@mui/icons-material';

export default function OrganizationsView(props) {
    let theme = useTheme();

    return (
        <Grid container>
            <Grid item xs={12} sx={{p: 2}}>
                <TextField
                  label={props.literals?.search_organization}
                  variant="outlined"
                  type="text"
                  onChange={props.handleSearch}
                  fullWidth
                />
            </Grid>
            <Grid item xs={12}>
                {!props.organizations.length && 
                    <Typography variant="subtitle1" color="secondary" sx={{textAlign: 'center'}}>{props.literals.no_record_found}</Typography>
                }
                <List>
                    {props.organizations.map(x => {
                        return (
                            <>
                                <ListItem disablePadding>
                                    <ListItemButton sx={{color: props.inputField.org == x._id && theme.palette.primary.main}} onClick={()=>props.onChange({org: x._id, org_name: x.org_name})}>
                                        {props.inputField.org == x._id && <ListItemIcon>
                                            <Done color="primary"/>
                                        </ListItemIcon>}
                                        <ListItemText primary={x.org_name} />
                                    </ListItemButton>

                                </ListItem>
                                <Divider />
                            </>
                        )
                    })
                    }
                </List>
            </Grid>
        </Grid>
    );
}