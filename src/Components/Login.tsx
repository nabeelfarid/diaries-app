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
import { green } from "@material-ui/core/colors";
import { LockOpen } from "@material-ui/icons";
import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import diariesApi from "../diariesApi";
import { saveToken, setAuthState, setUser } from "../diariesSlice";
import { useAppDispatch } from "../hooks";

interface LocationState {
  from: { pathname: string };
}

const useStyles = makeStyles((theme) => ({
  green: {
    color: "#fff",
    backgroundColor: green[500],
  },
}));

const Login: React.FC = () => {
  // let history = useHistory();
  let location = useLocation();
  // let auth = useAuth();

  let { from } = (location.state || {
    from: { pathname: "/" },
  }) as LocationState;
  console.log("from:", from);

  const classes = useStyles();
  const navigate = useNavigate();
  const txtUsername = useRef<HTMLInputElement>(null);
  const txtPassword = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const login = async () => {
      try {
        let username = txtUsername.current?.value as string;
        let password = txtPassword.current?.value as string;
        let user = await diariesApi.login(username, password);

        dispatch(saveToken(user.token));
        dispatch(setAuthState(true));
        dispatch(setUser(user));
        navigate(from.pathname, { replace: true });

        console.log("login succesfull", user);
      } catch (error) {
        console.log("login error", error);
      } finally {
      }
    };
    login();
  };

  return (
    <Box display="flex" justifyContent="center">
      <Card variant="outlined" style={{ maxWidth: "400px" }}>
        <CardHeader
          title={<Typography variant="h5">Log in to Your Account </Typography>}
          avatar={
            <Avatar className={classes.green}>
              <LockOpen />
            </Avatar>
          }
        ></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  inputRef={txtUsername}
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value="tester"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputRef={txtPassword}
                  label="Password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value="password"
                  autoComplete="off"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  Sign in
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  style={{ textTransform: "none" }}
                  onClick={() => navigate("../signup", { replace: true })}
                >
                  No Account? Create one
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
