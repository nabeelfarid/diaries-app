import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import { useAppSelector, useAppDispatch } from "../hooks";
import { selectDiariesAppState, setDiaries } from "../diariesSlice";
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
  const classes = useStyles();
  const { user, diaries } = useAppSelector(selectDiariesAppState);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUserDiaries = async () => {
      if (user) {
        try {
          let diaries = await diariesApi.getUserDiaries(user.id);

          dispatch(setDiaries(diaries));
          console.log("geUserDiaries succesfull", diaries);
          console.log("geUserDiaries succesfull", diaries.length);
        } catch (error) {
          console.log("geUserDiaries error", error);
        } finally {
        }
      }
    };

    getUserDiaries();
  }, [dispatch, user]);

  return (
    <Box mx="auto" maxWidth={600}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <Typography variant="h4">Your Diaries</Typography>
        </Grid>
        <Grid item xs={6}>
          <Box textAlign="right">
            <Fab color="primary" aria-label="add">
              <Add />
            </Fab>
          </Box>
        </Grid>
        {diaries && diaries.length > 0 && (
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <List>
                  {diaries.map((diary) => (
                    <>
                      {console.log(`Diary-${diary.id}`)}
                      <ListItem key={`Diary-${diary.id}`} button>
                        <ListItemAvatar>
                          <Avatar
                            className={
                              diary.public ? classes.green : classes.pink
                            }
                          >
                            {diary.public ? <Public /> : <Lock />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={diary.title}
                          secondary={new Date(diary.updated).toDateString()}
                        />
                        <ListItemSecondaryAction>
                          <IconButton aria-label="delete">
                            <Delete />
                          </IconButton>
                          <IconButton aria-label="edit">
                            <Edit />
                          </IconButton>
                          <IconButton aria-label="view">
                            <Badge badgeContent={4} color="secondary">
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
                    </>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default Diaries;
