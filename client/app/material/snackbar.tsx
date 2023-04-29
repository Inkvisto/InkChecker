import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';


export default function SimpleSnackbar({open, message, action, position = {vertical: 'bottom',
horizontal: 'left'}, type='infoBar'}:any) {
  
    const {vertical,horizontal} = position;
 
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
    };


    const Bar = (
        <Snackbar
        anchorOrigin={{ vertical, horizontal }}
         open={open}
         autoHideDuration={6000}
         onClose={handleClose}
         message={typeof message !== 'string' ? JSON.stringify(message) : message}
         action={action}
       />
    )

    
  
  
  
    return (
      <div>
       {Bar}
      </div>
    );
  }