import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { LockOpen } from "@material-ui/icons";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import diariesApi from "../diariesApi";
import { saveToken, setAuthState, setUser } from "../diariesSlice";
import { useAppDispatch } from "../hooks";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikMuiTextField from "./FormikMuiTextField";

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
  let location = useLocation();

  let { from } = (location.state || {
    from: { pathname: "/" },
  }) as LocationState;
  console.log("from:", from);

  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Box mx="auto" display="flex" justifyContent="center" maxWidth={400}>
      <Card variant="outlined">
        <CardHeader
          title={<Typography variant="h5">Log in to Your Account </Typography>}
          avatar={
            <Avatar className={classes.green}>
              <LockOpen />
            </Avatar>
          }
        ></CardHeader>
        <CardContent>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={Yup.object({
              username: Yup.string().required().min(6).max(20),
              password: Yup.string().required().min(6).max(20),
            })}
            onSubmit={async (values, helpers) => {
              // console.log(JSON.stringify(values, null, 2));
              // await new Promise((r) => setTimeout(r, 3000));
              // helpers.setSubmitting(false);

              try {
                let user = await diariesApi.login(
                  values.username,
                  values.password
                );

                dispatch(saveToken(user.token));
                dispatch(setAuthState(true));
                dispatch(setUser(user));

                navigate(from.pathname, { replace: true });

                console.log("login succesfull", user);
              } catch (error) {
                console.log("login error", error);
                helpers.setSubmitting(false);
                helpers.resetForm();
              } finally {
              }
            }}
          >
            {(props) => (
              <Form autoComplete="off">
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormikMuiTextField
                      name="username"
                      label="Username"
                      variant="outlined"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormikMuiTextField
                      name="password"
                      label="Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      startIcon={
                        props.isSubmitting && <CircularProgress size="1rem" />
                      }
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      disabled={props.isSubmitting}
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
                {/* <pre>{JSON.stringify(props.errors, null, 4)}</pre>
                <pre>{JSON.stringify(props.values, null, 4)}</pre> */}
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
