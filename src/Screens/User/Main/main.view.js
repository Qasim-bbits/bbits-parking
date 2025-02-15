import React, {useState} from 'react';
import {Layout} from "../../../components/SidebarHeaderWrapper";
import { GoogleMap, LoadScript, Polygon } from '@react-google-maps/api';
import {Autocomplete, Box, Button, TextField, Typography, useMediaQuery} from "@mui/material";
import Marker from "../../../assets/images/image/marker.png";

const cityPolygonOptions = {
  fillColor: "#535353",
  fillOpacity: 0.5,
  strokeColor: "#535353",
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}
const zonePolygonOptions = {
  // fillColor: props.color,
  // fillOpacity: 0.5,
  // strokeColor: props.color,
  strokeOpacity: 1,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  geodesic: false,
  zIndex: 1
}


export default function MainView(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mapref, setMapRef] = useState(null);

  const handleOnLoad = map => {
    setMapRef(map);
  };
  
  const handleCenterChanged = () => {
    if (mapref) {
      const newCenter = mapref.getCenter();
      props.handleMapCenter({lat: newCenter.lat(), lng: newCenter.lng()});
    }
  };

  const smDown = useMediaQuery((theme) => theme.breakpoints.down('sm'), {
    defaultMatches: true,
    noSsr: false
  });

  const containerStyle = {
    height: '82vh',
  };

  const btnStyle={width: smDown ? '60%' : '36%', borderRadius: 20}

  return (
    <Layout org={props.org} literals = {props.literals}>
      <div style={{position: 'relative'}}>
        {props.selectedZone !== null && <div style={{position: 'absolute', zIndex: 1, top: '43%', left: '49%'}}>
          <img src={Marker} width="30px"/>
        </div>}
        <LoadScript
          googleMapsApiKey="AIzaSyCLD8cITdyUJTXZCeXJAiMiThGIn6LNYYY"
          language="en"
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={props.center}
            zoom={props.zoom}
            onLoad={handleOnLoad}
            onCenterChanged={handleCenterChanged}
          >
            {props.cityPolygon.length > 0 && <Polygon
              paths={props.cityPolygon}
              options={cityPolygonOptions}
            />}
            {props.zones.length > 0 && props.zones.map(x=>{
              return(
                <Polygon
                  paths={x.polygon}
                  options={{
                    fillColor: props.color,
                    fillOpacity: 0.5,
                    strokeColor: props.color,
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    clickable: false,
                    draggable: false,
                    editable: false,
                    geodesic: false,
                    zIndex: 1
                  }}
                />
              )
            })}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                flexDirection: 'column',
                alignItems: 'flex-start',
                margin: smDown ? '20% 0 0 2%' : '6% 0 0 1%'
              }}
            >
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                blurOnSelect
                options={props.cities}
                getOptionLabel={(option) => option.city_name+' - '+option.org?.org_name}
                value={props.selectedCity}
                onChange={(event, newValue)=>props.onSelectedCity(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{width: smDown ? 200 : 300, backgroundColor: '#fff'}}
                    label={props.literals.search_city}
                    variant='outlined'
                    size='small'
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                  />
                )}
              />
              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                blurOnSelect
                options={props.zones}
                getOptionLabel={(option) => option.zone_name}
                value={props.selectedZone}
                onChange={(event, newValue)=>props.onSelectedZone(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{width: smDown ? 200 : 300, backgroundColor: '#fff', marginTop: 1}}
                    label={props.literals.search_zone}
                    variant='outlined'
                    size='small'
                    InputProps={{
                      ...params.InputProps,
                      type: 'search',
                    }}
                  />
                )}
              />
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',position: 'absolute', bottom: '23px', width: '100%'}}>
              {props.inPolygon && <Button size='large' variant='contained' style={btnStyle} onClick={props.confirmZone}>
                <Typography sx={{fontSize: smDown ? 'small' : 'large'}}>
                  {props.literals.confirm_your_zone}
                </Typography>
              </Button>}
            </Box>
          </GoogleMap>
        </LoadScript>
      </div>
    </Layout>
  );
}