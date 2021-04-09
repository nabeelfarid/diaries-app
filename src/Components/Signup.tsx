import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { pink } from "@material-ui/core/colors";
import { ExitToApp } from "@material-ui/icons";
import { useRef } from "react";
import diariesApi from "../diariesApi";
import { saveToken, setAuthState, setUser } from "../diariesSlice";
import { useAppDispatch } from "../hooks";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  pink: {
    color: "#fff",
    backgroundColor: pink[500],
  },
}));

const Signup: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const txtUsername = useRef<HTMLInputElement>(null);
  const txtPassword = useRef<HTMLInputElement>(null);
  const txtEmail = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const login = async () => {
      try {
        let username = txtUsername.current?.value as string;
        let password = txtPassword.current?.value as string;
        let email = txtEmail.current?.value as string;
        let user = await diariesApi.signup(username, password, email);
        console.log("token:", user.token);
        dispatch(saveToken(user.token));
        dispatch(setAuthState(true));
        dispatch(setUser(user));
        console.log("signup succesfull", user);
      } catch (error) {
        console.log("signup error", error);
      } finally {
      }
    };
    login();
  };

  return (
    <div>
      <Box display="flex" justifyContent="center">
        <Card variant="outlined" style={{ maxWidth: "400px" }}>
          <CardHeader
            title={<Typography variant="h5">Create an Account </Typography>}
            avatar={
              <Avatar className={classes.pink}>
                <ExitToApp />
              </Avatar>
            }
          ></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    inputRef={txtUsername}
                    label="Username"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputRef={txtPassword}
                    label="Password"
                    variant="outlined"
                    type="password"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    inputRef={txtEmail}
                    label="Email (Optional)"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    Sign Up
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    style={{ textTransform: "none" }}
                    onClick={() => navigate("../login", { replace: true })}
                  >
                    Aready have an account?
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Signup;
