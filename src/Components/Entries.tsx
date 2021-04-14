import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
  selectDiariesAppState,
  setSelectedDiary,
  setEntries,
  setSelectedEntry,
  addEntry,
  updateEntry,
  deleteEntry,
  showToast,
} from "../diariesSlice";
import React, { useEffect, useRef } from "react";
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
  Avatar,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  useTheme,
} from "@material-ui/core";

import {
  Edit,
  Add,
  Delete,
  ArrowBack,
  Replay,
  Warning,
} from "@material-ui/icons";
import { green, pink } from "@material-ui/core/colors";
import { Entry, ToastType } from "../models";
import { useNavigate, useParams } from "react-router-dom";

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

const Entries: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();
  const navigate = useNavigate();
  const { selectedDiary, entries, selectedEntry } = useAppSelector(
    selectDiariesAppState
  );
  const dispatch = useAppDispatch();
  let { diaryId } = useParams();

  const [open, setOpen] = React.useState(false);
  const [
    deleteConfirmationDialogOpenCloseState,
    setDeleteConfirmationDialogOpenCloseState,
  ] = React.useState(false);
  const txtTitle = useRef<HTMLInputElement>(null);
  const txtContent = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const getEntries = async () => {
      if (selectedDiary) {
        try {
          let diaries = await diariesApi.getEntries(selectedDiary.id);

          dispatch(setEntries(diaries));
          dispatch(setSelectedEntry(null));
          console.log("getEntries succesfull", diaries);
        } catch (error) {
          console.log("getEntries error", error);
        } finally {
        }
      } else {
        try {
          //incase user get to the enries page diretly and not from Diaries List page
          // e.g. by pasting the url int he address bar
          let diary = await diariesApi.getDiary(Number(diaryId));
          if (diary) {
            dispatch(setSelectedDiary(diary));
            console.log("geDiary succesfull", diary);
          } else {
            //if diary doesnt' exist navigate to home page
            navigate("/", { replace: true });
          }
        } catch (error) {
          console.log("geDiary error", error);
        } finally {
        }
      }
    };

    getEntries();
  }, [dispatch, selectedDiary, navigate, diaryId]);

  const handleEdit = (entry: Entry) => {
    dispatch(setSelectedEntry(entry));
    setOpen(true);
  };

  const handleCreate = () => {
    dispatch(setSelectedEntry(null));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBack = () => {
    navigate("/diaries", { replace: true });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const createEntry = async () => {
      if (selectedDiary) {
        try {
          let title = txtTitle.current?.value as string;
          let content = txtContent.current?.value as string;

          console.log(title, content);
          let entry: Entry;
          if (selectedEntry) {
            entry = await diariesApi.editEntry(
              selectedEntry.id,
              title,
              content
            );
            dispatch(updateEntry(entry));
          } else {
            entry = await diariesApi.createEntry(
              title,
              content,
              selectedDiary.id
            );
            dispatch(addEntry(entry));
          }
          dispatch(setSelectedEntry(null));
          setOpen(false);
          console.log("Entry created/edit succesfully", entry);
          dispatch(
            showToast({
              type: ToastType.success,
              open: true,
              msg: "Entry saved successfully.",
            })
          );
        } catch (error) {
          console.log("Create/Edit Entry Error", error);
        } finally {
        }
      }
    };

    createEntry();
  };

  const handleDelete = (entry: Entry) => {
    dispatch(setSelectedEntry(entry));
    setDeleteConfirmationDialogOpenCloseState(true);
  };

  const handleDeleteConfirmationDialogClose = () => {
    dispatch(setSelectedEntry(null));
    setDeleteConfirmationDialogOpenCloseState(false);
  };

  const handleConfirmDelete = () => {
    const delEntry = async () => {
      if (selectedEntry) {
        try {
          let entry = await diariesApi.deleteEntry(selectedEntry.id);
          dispatch(deleteEntry(entry));
          dispatch(setSelectedEntry(null));
          setDeleteConfirmationDialogOpenCloseState(false);
          console.log("Entry deleted succesfully", entry);
          dispatch(
            showToast({
              type: ToastType.success,
              open: true,
              msg: "Entry deleted successfully.",
            })
          );
        } catch (error) {
          console.log("Delete Entry Error", error);
        } finally {
        }
      }
    };

    delEntry();
  };

  return (
    <>
      {selectedDiary && (
        <>
          <Box mx="auto" maxWidth={theme.breakpoints.width("sm")}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={10}>
                <Box display="flex" alignItems="center">
                  <IconButton
                    // color="inherit"
                    aria-label="back"
                    onClick={handleBack}
                    style={{ marginRight: "8px" }}
                    title="Back to Diaries"
                  >
                    <ArrowBack />
                  </IconButton>
                  <Typography variant="h4" component="span">
                    Entries for {selectedDiary?.title}:
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={2}>
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
              {entries.length > 0 && (
                <Grid item xs={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <List>
                        {[...entries]
                          .sort((a, b) => b.updated - a.updated)
                          .map((entry) => (
                            <React.Fragment key={`Entry-${entry.id}`}>
                              <ListItem key={`ListItem-${entry.id}`} button>
                                <ListItemText
                                  primary={entry.title}
                                  secondary={new Date(
                                    entry.updated
                                  ).toDateString()}
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    aria-label="delete"
                                    onClick={() => handleDelete(entry)}
                                  >
                                    <Delete />
                                  </IconButton>
                                  <IconButton
                                    aria-label="edit"
                                    onClick={() => handleEdit(entry)}
                                  >
                                    <Edit />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                              <Divider
                                variant="fullWidth"
                                component="li"
                                key={`Divider-${entry.id}`}
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
            aria-labelledby="create-new-entry"
          >
            <DialogTitle id="form-dialog-create-new-entry">
              <Box display="flex" alignItems="center">
                <Box mr={2}>
                  <Avatar className={classes.green}>
                    <Add />
                  </Avatar>
                </Box>
                <Typography variant="h5">
                  {selectedDiary
                    ? `Edit Entry: ${selectedDiary.title}`
                    : `Create New Entry`}
                </Typography>
              </Box>
            </DialogTitle>
            <form onSubmit={handleSubmit} autoComplete="off">
              <DialogContent dividers>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      inputRef={txtTitle}
                      label="Title"
                      variant="outlined"
                      fullWidth
                      defaultValue={selectedEntry ? selectedEntry.title : ``}
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      multiline
                      rows={4}
                      rowsMax={10}
                      inputRef={txtContent}
                      label="Content"
                      variant="outlined"
                      fullWidth
                      defaultValue={selectedEntry ? selectedEntry.content : ``}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              {/* </Box> */}
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
            aria-labelledby="delete-entry"
          >
            <DialogTitle id="form-dialog-delete-entry">
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
      )}
    </>
  );
};

export default Entries;
