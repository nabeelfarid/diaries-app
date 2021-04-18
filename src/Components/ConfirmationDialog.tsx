import { createStyles, makeStyles } from "@material-ui/core/styles";

import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";

import { Warning } from "@material-ui/icons";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles(() =>
  createStyles({
    red: {
      color: "#fff",
      backgroundColor: red[500],
    },
  })
);

interface ConfirmationDialogProps {
  open: boolean;
  disable: boolean;
  handleNo: () => void;
  handleYes: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  disable,
  handleNo,
  handleYes,
}) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleNo} aria-labelledby="confirm-dialog">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Avatar className={classes.red}>
              <Warning />
            </Avatar>
          </Box>
          <Typography variant="h5">Are you sure?</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box mb={2} textAlign="center">
          <Button
            style={{ marginRight: "16px" }}
            variant="outlined"
            onClick={handleNo}
          >
            No
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleYes();
            }}
            disabled={disable}
          >
            Yes
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
