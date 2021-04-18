import { createStyles, makeStyles } from "@material-ui/core/styles";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  selectDiariesAppState,
  addDiary,
  updateDiary,
  showToast,
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
import { Edit, Add } from "@material-ui/icons";
import { green, pink } from "@material-ui/core/colors";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import FormikMuiTextField from "./FormikMuiTextField";
import FormikMuiSwitch from "./FormikMuiSwitch";
import { Diary, ToastType } from "../models";

interface DiaryCreateEditProps {
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

const DiaryCreateEdit: React.FC<DiaryCreateEditProps> = ({
  open,
  handleClose,
}) => {
  const classes = useStyles();
  const { user, selectedDiary } = useAppSelector(selectDiariesAppState);
  const dispatch = useAppDispatch();

  const handleCreateEditSubmit = async (
    values: {
      title: string;
      subtitle: string;
      isPublic: boolean;
    },
    formikHelpers: FormikHelpers<{
      title: string;
      subtitle: string;
      isPublic: boolean;
    }>
  ) => {
    if (user) {
      try {
        let diary: Diary;
        if (selectedDiary) {
          diary = await diariesApi.editDiary(
            selectedDiary.id,
            values.title,
            values.subtitle,
            values.isPublic,
            user.id
          );
          dispatch(updateDiary(diary));
        } else {
          diary = await diariesApi.createDiary(
            values.title,
            values.subtitle,
            values.isPublic,
            user.id
          );
          dispatch(addDiary(diary));
        }
        console.log("Diary created/edit succesfully", diary);
        dispatch(
          showToast({
            type: ToastType.success,
            open: true,
            msg: "Diary saved successfully.",
          })
        );
        handleClose();
      } catch (error) {
        console.log("Create/Edit Diary Error", error);
      } finally {
        formikHelpers.setSubmitting(false);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="create-new-diary"
    >
      <DialogTitle id="form-dialog-create-new-diary">
        <Box display="flex" alignItems="center">
          <Box mr={2}>
            <Avatar className={classes.green}>
              {selectedDiary ? <Edit /> : <Add />}
            </Avatar>
          </Box>
          <Typography variant="h5">
            {selectedDiary
              ? `Edit Diary: ${selectedDiary.title}`
              : `Create New Diary`}
          </Typography>
        </Box>
      </DialogTitle>
      <Formik
        initialValues={
          selectedDiary
            ? {
                title: selectedDiary.title,
                subtitle: selectedDiary.subtitle,
                isPublic: selectedDiary.isPublic,
              }
            : { title: "", subtitle: "", isPublic: true }
        }
        validationSchema={Yup.object({
          title: Yup.string().required().min(1).max(50),
          subtitle: Yup.string().min(1).max(50),
        })}
        onSubmit={handleCreateEditSubmit}
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
                    name="subtitle"
                    label="Subtitle"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <FormikMuiSwitch
                    name="isPublic"
                    label="Is it a Public Diary?"
                  />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions>
              <Button
                type="reset"
                onClick={() => {
                  handleClose();
                }}
              >
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

export default DiaryCreateEdit;
