import React, { useState, useRef } from 'react';
import { useTheme, Button, Dialog, Paper } from '@mui/material';
import Grid from '@mui/material/Grid';
import { CameraEnhanceOutlined, Close } from '@mui/icons-material';
import Webcam from "react-webcam";

export default function ImageView(props) {
    let theme = useTheme();

    const FACING_MODE_ENVIRONMENT = "environment";
    const [facingMode, setFacingMode] = React.useState(FACING_MODE_ENVIRONMENT);

    const webcamRef = useRef(null);
    const [img, setImg] = useState(null);
    const [openCamera, setOpenCamera] = React.useState(false);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        let images = props.inputField?.images || [];
        images.push(imageSrc);
        props.setInputField({...props.inputField, images: images});
        setOpenCamera(false)
    };

    const removeImage = (value) => {
        let images = props.inputField?.images.filter(item => item !== value);
        props.setInputField({...props.inputField, images: images});
    }

    return (
        <Grid container spacing={2} sx={{p:2}}>
            <Grid item xs={12}>
                <Dialog
                    fullScreen
                    open={openCamera}
                    onClose={() => setOpenCamera(false)}
                >
                    <Webcam
                        width={'100%'}
                        height={'100%'}
                        screenshotFormat='image/webp'
                        mirrored={false}
                        ref={webcamRef}
                        videoConstraints={{
                            ...{
                                facingMode: FACING_MODE_ENVIRONMENT
                            },
                            facingMode
                        }}
                    />
                    <Button variant="outlined" size="large" type="button" onClick={()=>setOpenCamera(false)} sx={{position: 'absolute', top: 15, right: 15}}>
                        <Close />
                    </Button>
                    <Button variant="outlined" size="large" type="button" onClick={capture} sx={{position: 'absolute', bottom: '15px', borderRadius: '30px', background: '#80808087', left: 0, right: 0, marginLeft: 'auto', marginRight: 'auto', width: 'fit-content'}}>
                        <CameraEnhanceOutlined />
                    </Button>
                </Dialog>
            </Grid>
            {props.inputField?.images?.map((x) => {
                return(
                    <Grid item xs={6} sx={{position: "relative"}}>
                        <Paper elevation={3} sx={{ height: '150px'}}>
                            <img src={x} alt="screenshot" width="100%" height={"100%"}/>
                            <Button variant="text" color='error' size="large" type="button" sx={{position: 'absolute', top: 5, right: '-10px', p: 0, minWidth: 'fit-content'}} onClick={()=>removeImage(x)}>
                                <Close />
                            </Button>
                        </Paper>
                    </Grid>
                )
            })}
            {(!props.inputField.images || props.inputField.images?.length < 5) && <Grid item xs={6}>
                <Paper elevation={3} sx={{ height: '150px', textAlign: 'center', alignContent: 'center'}} onClick={()=>setOpenCamera(true)}>
                    <Button variant="outlined" color='primary' type="button" sx={{border: '1px dashed '+theme.palette.primary.main}}>
                        <CameraEnhanceOutlined />
                    </Button>
                </Paper>
            </Grid>}
        </Grid>
    );
}