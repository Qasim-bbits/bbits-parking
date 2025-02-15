import React, { useEffect, useState } from 'react';
import ImageView from './ImageView';
import cityServices from '../../../../services/city-service';
import Spinner from '../../../../shared/Spinner';


export default function Image(props) {
    

    return (
        <>
            <ImageView
                inputField={props.inputField}
                setInputField={props.setInputField}
            />
        </>
    );
}