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
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Switch,
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
  const [formValues, setFormValues] = React.useState(
    selectedDiary
      ? {
          title: selectedDiary.title,
          subtitle: selectedDiary.subtitle,
          isPublic: selectedDiary.isPublic,
        }
      : { title: "", subtitle: "", isPublic: true }
  );
  useEffect(() => {
    console.log("selectedDiary:", selectedDiary);
    setFormValues(
      selectedDiary
        ? {
            title: selectedDiary.title,
            subtitle: selectedDiary.subtitle,
            isPublic: selectedDiary.isPublic,
          }
        : { title: "", subtitle: "", isPublic: true }
    );
  }, [open, selectedDiary]);

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

  const handleCreateEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createDiary = async () => {
      if (user) {
        try {
          console.log(formValues);
          let diary: Diary;
          if (selectedDiary) {
            diary = await diariesApi.editDiary(
              selectedDiary.id,
              formValues.title,
              formValues.subtitle,
              formValues.isPublic,
              user.id
            );
            dispatch(updateDiary(diary));
          } else {
            diary = await diariesApi.createDiary(
              formValues.title,
              formValues.subtitle,
              formValues.isPublic,
              user.id
            );
            dispatch(addDiary(diary));
          }
          dispatch(setSelectedDiary(null));
          setOpen(false);
          console.log("Diary created/edit succesfully", diary);
          dispatch(
            showToast({
              type: ToastType.success,
              open: true,
              msg: "Diary saved successfully.",
            })
          );
        } catch (error) {
          console.log("Create/Edit Diary Error", error);
        } finally {
        }
      }
    };

    createDiary();
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
        <form onSubmit={handleCreateEditSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  value={formValues.title}
                  label="Title"
                  variant="outlined"
                  fullWidth
                  autoFocus
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      title: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  value={formValues.subtitle}
                  label="Subtitle"
                  variant="outlined"
                  fullWidth
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      subtitle: e.target.value,
                    })
                  }
                />
              </Grid>
              <Grid item>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formValues.isPublic}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          isPublic: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Is it a Public Diary?"
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
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
