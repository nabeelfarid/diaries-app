import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  selectDiariesAppState,
  showToast,
  updateEntry,
  addEntry,
} from "../diariesSlice";
import React from "react";
import diariesApi from "../diariesApi";
import {
  Box,
  Grid,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { green, pink } from "@material-ui/core/colors";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import FormikMuiTextField from "./FormikMuiTextField";
import { Entry, ToastType } from "../models";

interface EntryCreateEditProps {
  open: boolean;
  handleClose: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {},
    green: {
      color: "#fff",
      backgroundColor: green[500],
    },
    pink: {
      color: "#fff",
      backgroundColor: pink[500],
    },
  })
);

const EntryCreateEdit: React.FC<EntryCreateEditProps> = ({
  open,
  handleClose,
}) => {
  const classes = useStyles();
  const { selectedDiary, selectedEntry } = useAppSelector(
    selectDiariesAppState
  );
  const dispatch = useAppDispatch();

  const handleSubmit = async (
    values: {
      title: string;
      content: string;
    },
    formikHelpers: FormikHelpers<{
      title: string;
      content: string;
    }>
  ) => {
    if (selectedDiary) {
      try {
        let entry: Entry;
        if (selectedEntry) {
          entry = await diariesApi.editEntry(
            selectedEntry.id,
            values.title,
            values.content
          );
          dispatch(updateEntry(entry));
        } else {
          entry = await diariesApi.createEntry(
            values.title,
            values.content,
            selectedDiary.id
          );
          dispatch(addEntry(entry));
        }

        console.log("Entry created/edit succesfully", entry);
        dispatch(
          showToast({
            type: ToastType.success,
            open: true,
            msg: "Entry saved successfully.",
          })
        );
        handleClose();
      } catch (error) {
        console.log("Create/Edit Entry Error", error);
      } finally {
        formikHelpers.setSubmitting(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="create-edit-entry"
    >
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Avatar className={classes.green}>
              <Add />
            </Avatar>
          </Box>
          <Typography variant="h5">
            {selectedEntry
              ? `Edit Entry: ${selectedEntry.title}`
              : `Create New Entry`}
          </Typography>
        </Box>
      </DialogTitle>
      <Formik
        initialValues={
          selectedEntry
            ? {
                title: selectedEntry.title,
                content: selectedEntry.content,
              }
            : { title: "", content: "" }
        }
        validationSchema={Yup.object({
          title: Yup.string().required().min(1).max(50),
        })}
        onSubmit={handleSubmit}
      >
        {(props) => (
          <Form>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormikMuiTextField
                    name="title"
                    label="Title"
                    variant="outlined"
                    fullWidth
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormikMuiTextField
                    name="content"
                    multiline
                    rows={4}
                    rowsMax={10}
                    label="Content"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button type="reset" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={
                  props.isSubmitting && <CircularProgress size="1rem" />
                }
                disabled={props.isSubmitting}
              >
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default EntryCreateEdit;
