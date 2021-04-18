import {
  createStyles,
  Theme,
  makeStyles,
  useTheme,
} from "@material-ui/core/styles";

import { useAppSelector, useAppDispatch } from "../hooks";
import {
  selectDiariesAppState,
  setDiaries,
  setSelectedDiary,
  addDiary,
  updateDiary,
  deleteDiary,
  setEntries,
  showToast,
} from "../diariesSlice";
import React, { useEffect } from "react";
import diariesApi from "../diariesApi";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Fab,
  Grid,
  IconButton,
  ListItemSecondaryAction,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  CircularProgress,
} from "@material-ui/core";

import {
  Edit,
  LibraryBooks,
  Add,
  Delete,
  Lock,
  Public,
  Warning,
} from "@material-ui/icons";
import { green, pink } from "@material-ui/core/colors";
import { Diary, ToastType } from "../models";
import { useNavigate } from "react-router-dom";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import FormikMuiTextField from "./FormikMuiTextField";
import FormikMuiSwitch from "./FormikMuiSwitch";

const useStyles = makeStyles((theme: Theme) =>
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

const Diaries: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();

  const navigate = useNavigate();
  const { user, diaries, selectedDiary } = useAppSelector(
    selectDiariesAppState
  );
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);
  const [
    deleteConfirmationDialogOpenCloseState,
    setDeleteConfirmationDialogOpenCloseState,
  ] = React.useState(false);

  useEffect(() => {
    const getUserDiaries = async () => {
      if (user && diaries.length === 0) {
        try {
          let diaries = await diariesApi.getUserDiaries(user.id);

          dispatch(setDiaries(diaries));
          dispatch(setSelectedDiary(null));
          console.log("geUserDiaries succesfull", diaries);
        } catch (error) {
          console.log("geUserDiaries error", error);
        } finally {
        }
      }
    };

    getUserDiaries();
  }, [dispatch, user, diaries.length]);

  const handleCreate = () => {
    dispatch(setSelectedDiary(null));
    setOpen(true);
  };

  const handleEdit = (diary: Diary) => {
    dispatch(setSelectedDiary(diary));
    setOpen(true);
  };

  const handleViewEntries = (diary: Diary) => {
    dispatch(setSelectedDiary(diary));
    dispatch(setEntries([]));
    setOpen(false);
    navigate(`/diaries/${diary.id}/entries`, { replace: true });
  };

  const handleClose = () => {
    dispatch(setSelectedDiary(null));
    setOpen(false);
  };

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
        dispatch(setSelectedDiary(null));
        console.log("Diary created/edit succesfully", diary);
        dispatch(
          showToast({
            type: ToastType.success,
            open: true,
            msg: "Diary saved successfully.",
          })
        );
        setOpen(false);
      } catch (error) {
        console.log("Create/Edit Diary Error", error);
      } finally {
        formikHelpers.setSubmitting(false);
      }
    }
  };

  const handleDelete = (diary: Diary) => {
    dispatch(setSelectedDiary(diary));
    setDeleteConfirmationDialogOpenCloseState(true);
  };

  const handleDeleteConfirmationDialogClose = () => {
    dispatch(setSelectedDiary(null));
    setDeleteConfirmationDialogOpenCloseState(false);
  };

  const handleConfirmDelete = () => {
    const delDiary = async () => {
      if (selectedDiary) {
        try {
          let diary = await diariesApi.deleteDiary(selectedDiary.id);
          dispatch(deleteDiary(diary));
          dispatch(setSelectedDiary(null));
          setDeleteConfirmationDialogOpenCloseState(false);
          console.log("Diary deleted succesfully", diary);
          dispatch(
            showToast({
              type: ToastType.success,
              open: true,
              msg: "Diary deleted successfully.",
            })
          );
        } catch (error) {
          console.log("Delete Diary Error", error);
        } finally {
        }
      }
    };

    delDiary();
  };

  return (
    <>
      <Box mx="auto" maxWidth={theme.breakpoints.width("sm")}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4">Your Diaries</Typography>
          </Grid>
          <Grid item xs={6}>
            <Box textAlign="right">
              <Fab
                color="primary"
                aria-label="create-new-diary"
                onClick={handleCreate}
              >
                <Add />
              </Fab>
            </Box>
          </Grid>
          {diaries && diaries.length > 0 && (
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <List>
                    {[...diaries]
                      .sort((a, b) => b.updated - a.updated)
                      .map((diary) => (
                        <React.Fragment key={`Diary-${diary.id}`}>
                          <ListItem key={`ListItem-${diary.id}`} button>
                            <ListItemAvatar>
                              <Avatar
                                className={
                                  diary.isPublic ? classes.green : classes.pink
                                }
                              >
                                {diary.isPublic ? <Public /> : <Lock />}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={diary.title}
                              secondary={new Date(diary.updated).toDateString()}
                            />
                            <ListItemSecondaryAction>
                              <IconButton
                                aria-label="delete"
                                onClick={() => handleDelete(diary)}
                              >
                                <Delete />
                              </IconButton>
                              <IconButton
                                aria-label="edit"
                                onClick={() => handleEdit(diary)}
                              >
                                <Edit />
                              </IconButton>
                              <IconButton
                                aria-label="view"
                                onClick={() => handleViewEntries(diary)}
                              >
                                <Badge
                                  badgeContent={diary.entryIds.length}
                                  color="secondary"
                                >
                                  <LibraryBooks />
                                </Badge>
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                          <Divider
                            variant="fullWidth"
                            component="li"
                            key={`Divider-${diary.id}`}
                          />
                        </React.Fragment>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>

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
                <Button onClick={handleClose}>Cancel</Button>
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

      <Dialog
        open={deleteConfirmationDialogOpenCloseState}
        onClose={handleDeleteConfirmationDialogClose}
        aria-labelledby="delete-diary"
      >
        <DialogTitle id="form-dialog-delete-diary">
          <Box display="flex" alignItems="center">
            <Box mr={2}>
              <Avatar className={classes.pink}>
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
              onClick={handleDeleteConfirmationDialogClose}
            >
              No
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleConfirmDelete}
            >
              Yes
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Diaries;
