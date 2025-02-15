import React, { useState } from 'react';
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { DownloadOutlined } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Spinner from '../../Common/Spinner';

const PDFDownloader = ({rootElementId , downloadFileName}) => {
    const [showSpinner, setShowSpinner] = useState(false);

    const downloadPdfDocument = () => {
        setShowSpinner(true);
        const input = document.getElementById(rootElementId);
        html2canvas(input, {scrollY: -window.scrollY})
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps= pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`${downloadFileName}.pdf`, {returnPromise:true})
                .then(()=>{
                    setShowSpinner(false);
                });
            })
    }

    return (
        <>
            <IconButton
                sx={{color: '#fff', marginRight: 1}}
                edge="end"
                onClick={downloadPdfDocument}
            >
                <DownloadOutlined />
            </IconButton>
            <Spinner
                spinner = {showSpinner}
            />
        </>
    )
}
export default PDFDownloader;