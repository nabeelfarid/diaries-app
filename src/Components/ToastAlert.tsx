import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import { useAppSelector } from "../hooks";
import { selectDiariesAppState, showToast } from "../diariesSlice";
import { useDispatch } from "react-redux";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";

function TransitionLeft(props: TransitionProps) {
  return <Slide {...props} direction="left" />;
}

const ToastAlert = () => {
  const { toast } = useAppSelector(selectDiariesAppState);
  const dispatch = useDispatch();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    //hide toast
    dispatch(showToast({ ...toast, open: false }));
  };

  return (
    <Snackbar
      open={toast.open}
      autoHideDuration={2000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      TransitionComponent={TransitionLeft}
    >
      <Alert onClose={handleClose} severity={toast.type} variant="filled">
        {toast.msg}
      </Alert>
    </Snackbar>
  );
};

export default ToastAlert;
