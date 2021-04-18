import { useAppSelector, useAppDispatch } from "../hooks";
import {
  selectDiariesAppState,
  setSelectedDiary,
  setEntries,
  setSelectedEntry,
  deleteEntry,
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
  useTheme,
} from "@material-ui/core";

import { Edit, Add, Delete, ArrowBack } from "@material-ui/icons";
import { Entry, ToastType } from "../models";
import { useNavigate, useParams } from "react-router-dom";

import ConfirmationDialog from "./ConfirmationDialog";
import EntryCreateEdit from "./EntryCreateEdit";

const Entries: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { selectedDiary, entries, selectedEntry } = useAppSelector(
    selectDiariesAppState
  );
  const dispatch = useAppDispatch();
  let { diaryId } = useParams();

  const [open, setOpen] = React.useState(false);
  const [
    confirmationDialogOpenState,
    setConfirmationDialogOpenState,
  ] = React.useState(false);
  const [
    confirmationDialogDisableState,
    setConfirmationDialogDisableState,
  ] = React.useState(false);

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
    dispatch(setSelectedEntry(null));
    setOpen(false);
  };

  const handleBack = () => {
    navigate("/diaries", { replace: true });
  };

  const handleDelete = (entry: Entry) => {
    dispatch(setSelectedEntry(entry));
    setConfirmationDialogOpenState(true);
  };

  const handleConfirmationDialogClose = () => {
    dispatch(setSelectedEntry(null));
    setConfirmationDialogOpenState(false);
  };

  const handleConfirmDelete = () => {
    const delEntry = async () => {
      if (selectedEntry) {
        try {
          setConfirmationDialogDisableState(true);
          let entry = await diariesApi.deleteEntry(selectedEntry.id);
          dispatch(deleteEntry(entry));
          dispatch(setSelectedEntry(null));
          setConfirmationDialogOpenState(false);
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
          setConfirmationDialogDisableState(false);
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

          <EntryCreateEdit open={open} handleClose={handleClose} />

          <ConfirmationDialog
            open={confirmationDialogOpenState}
            disable={confirmationDialogDisableState}
            handleNo={handleConfirmationDialogClose}
            handleYes={handleConfirmDelete}
          />
        </>
      )}
    </>
  );
};

export default Entries;
