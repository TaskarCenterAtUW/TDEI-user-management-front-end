import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import style from "./toastmessage.module.css";

export default function ResponseToast(props) {
  return (
    <div>
      <Snackbar 
        autoHideDuration={props.autoHideDuration === undefined ? 3000 : props.autoHideDuration}
        anchorOrigin={{ vertical:'top', horizontal:'center' }}
        open={props.showtoast} onClose={props.handleClose}>
        <Alert
          onClose={props.handleClose}
          severity={props.type}
          variant="filled"
          className={style.toastMsgContainer}
          sx={{ backgroundColor: props.type == "success" ? "#1EAD80" : "#c84349" }}
        >
          <span className={style.contentPosition}>{props.message}</span>
        </Alert>
      </Snackbar>
    </div>
  );
}
