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
} from "@material-ui/core";

import {
  Edit,
  LibraryBooks,
  Add,
  Delete,
  Lock,
  Public,
} from "@material-ui/icons";
import { green, pink } from "@material-ui/core/colors";
import { Diary, ToastType } from "../models";
import { useNavigate } from "react-router-dom";
import DiaryCreateEdit from "./DiaryCreateEdit";
import ConfirmationDialog from "./ConfirmationDialog";

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
    confirmationDialogOpenState,
    setConfirmationDialogOpenState,
  ] = React.useState(false);
  const [
    confirmationDialogDisableState,
    setConfirmationDialogDisableState,
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

  const handleDelete = (diary: Diary) => {
    dispatch(setSelectedDiary(diary));
    setConfirmationDialogOpenState(true);
  };

  const handleConfirmationDialogClose = () => {
    dispatch(setSelectedDiary(null));
    setConfirmationDialogOpenState(false);
  };

  const handleConfirmDelete = () => {
    const delDiary = async () => {
      if (selectedDiary) {
        try {
          setConfirmationDialogDisableState(true);

          let diary = await diariesApi.deleteDiary(selectedDiary.id);
          dispatch(deleteDiary(diary));
          dispatch(setSelectedDiary(null));
          setConfirmationDialogOpenState(false);
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
          setConfirmationDialogDisableState(false);
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

      <DiaryCreateEdit open={open} handleClose={handleClose} />

      <ConfirmationDialog
        open={confirmationDialogOpenState}
        disable={confirmationDialogDisableState}
        handleNo={handleConfirmationDialogClose}
        handleYes={handleConfirmDelete}
      />
    </>
  );
};

export default Diaries;
