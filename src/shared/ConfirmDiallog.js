import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ConfirmDiallog(prop) {
  const dialogTitle = 'Are you sure you want to delete this item?';
  const dialogContent = 'This item will no longer be stored and may effect other pages.';
  return (
    <div>
      <Dialog
        open={prop.openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={prop.closeDialog}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{prop.dialogTitle || dialogTitle}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {prop.dialogContent || dialogContent}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={prop.closeDialog} sx={{color: '#454545'}}>Cancel</Button>
          <Button onClick={prop.delItem} variant="contained" color="secondary">Yes</Button> 
        </DialogActions>
      </Dialog>
    </div>
  );
}
