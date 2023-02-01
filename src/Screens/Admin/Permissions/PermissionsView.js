import React from 'react'
import { Grid, useTheme, Divider, Typography, IconButton, Paper } from '@mui/material'
import Tree from 'react-animated-tree'
import { config } from '../../../Constants'
import { AddCircleOutlined, Delete, Edit, EditOff, Visibility, VisibilityOff } from "@mui/icons-material";

export default function PermissionsView(props) {
  const theme = useTheme();
  const permission = [
    {label: <Visibility sx={{color: theme.palette.primary.main}}/>, labelOff: <VisibilityOff sx={{color: theme.palette.tertiary.main}}/>, value: 'can_view'},
    {label: <AddCircleOutlined sx={{color: theme.palette.primary.main}}/>, labelOff: <AddCircleOutlined sx={{color: theme.palette.tertiary.main}}/>, value: 'can_add'},
    {label: <Edit sx={{color: theme.palette.primary.main}}/>, labelOff: <EditOff sx={{color: theme.palette.tertiary.main}}/>, value: 'can_edit'},
    {label: <Delete sx={{color: theme.palette.primary.main}}/>, labelOff: <Delete sx={{color: theme.palette.tertiary.main}}/>, value: 'can_delete'},
  ]
  const treeStyles = {
    width: '100%',
    color: theme.palette.tertiary.main
  }

  return (
    <Grid container spacing={3} sx={{placeContent: "center"}}>
      <Grid item xs={12} md={4} lg={4} sm={12}>
        <Paper elevation={2} sx={{p:2, background: '#f2f2f2', height: '100%'}}>
          <Divider>
            <Typography variant="subtitle1" sx={{color: theme.palette.tertiary.main}}>
              {props.literals.organization} & {props.literals.user}
            </Typography>  
          </Divider>
          {props.permissions.map(x=>{
            if(x.child.length > 0){
              return(
                <Tree content={x.org_name} type={<img src={config.url.API_URL + x.logo} width="30px" alt=""/>} open style={treeStyles}>
                  {x.child[0].users !== undefined &&
                    <Tree content={x.email} style={{ color: theme.palette.primary.main }} canHide onClick={()=>props.getUserPermissions(x._id)}/>
                  }
                  {x.child.map(y=>{
                    return(
                      <>
                        {y.users !== undefined &&
                          <Tree content={y.org_name} type={<img src={config.url.API_URL + y.logo} width="30px" alt=""/>} open>
                            {y.users.map(z=>{
                              return(
                                <Tree content={z.email} style={{ color: theme.palette.primary.main }} canHide onClick={()=>props.getUserPermissions(z._id)}/>
                              )
                            })}
                          </Tree>
                        }
                        {y.users == undefined &&
                          <Tree content={y.email} style={{ color: theme.palette.primary.main }} canHide onClick={()=>props.getUserPermissions(y._id)}/>
                        }
                      </>
                    )
                  })}
                </Tree>
              )
            }else{
              <Tree content={x.org_name} type={<img src={config.url.API_URL + x.logo} width="30px" alt=""/>} open style={treeStyles}/>
            }
          })}
        </Paper>
      </Grid>
      <Grid item xs={12} md={8} lg={8} sm={12}>
        <Divider>
          <Typography variant="subtitle1" sx={{color: theme.palette.tertiary.main}}>
            {props.literals.permissions}
          </Typography>  
        </Divider>
        <Grid container spacing={2} sx={{alignItems: "center"}}>
          {props.userPermission.map(x=>{
            if(x.module.key == 'module' || x.module.key == 'organizations'){
              return;
            }
            return(
              <>
                <Grid item xs={5}>
                  <Typography variant="subtitle1" sx={{color: theme.palette.tertiary.main}}>
                    {x.module.module_name}
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  {permission.map(y=>{
                    return(
                      <IconButton
                        sx={{mx: 2}}
                        onClick={()=>props.handleSwitch(y.value, x._id, x.user._id)}
                      >
                        {(x[y.value] == true) ? y.label : y.labelOff}
                      </IconButton>
                    )
                  })}
                </Grid>
              </>
            )
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}

