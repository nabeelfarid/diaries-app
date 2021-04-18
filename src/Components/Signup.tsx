import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  makeStyles,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import { pink } from "@material-ui/core/colors";
import { ExitToApp } from "@material-ui/icons";
import { useRef } from "react";
import diariesApi from "../diariesApi";
import { saveToken, setAuthState, setUser } from "../diariesSlice";
import { useAppDispatch } from "../hooks";
import { useNavigate } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikMuiTextField from "./FormikMuiTextField";

const useStyles = makeStyles((theme) => ({
  pink: {
    color: "#fff",
    backgroundColor: pink[500],
  },
}));

const Signup: React.FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <Box mx="auto" display="flex" justifyContent="center" maxWidth={400}>
      <Card variant="outlined">
        <CardHeader
          title={<Typography variant="h5">Create an Account </Typography>}
          avatar={
            <Avatar className={classes.pink}>
              <ExitToApp />
            </Avatar>
          }
        ></CardHeader>
        <CardContent>
          <Formik
            initialValues={{
              username: "",
              password: "",
              confirmPassword: "",
              email: "",
            }}
            validationSchema={Yup.object({
              username: Yup.string().required().min(6).max(20),
              password: Yup.string().required().min(6).max(20),
              confirmPassword: Yup.string().oneOf(
                [Yup.ref("password")],
                "Passwords must match"
              ),
              email: Yup.string().email(),
            })}
            onSubmit={async (values, helpers) => {
              try {
                let user = await diariesApi.signup(
                  values.username,
                  values.password,
                  values.email
                );
                console.log("token:", user.token);
                dispatch(saveToken(user.token));
                dispatch(setAuthState(true));
                dispatch(setUser(user));

                console.log("signup succesfull", user);
              } catch (error) {
                helpers.setSubmitting(false);
                console.log("signup error", error);
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
                    <FormikMuiTextField
                      name="confirmPassword"
                      label="Confirm Password"
                      variant="outlined"
                      type="password"
                      fullWidth
                      autoComplete="off"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormikMuiTextField
                      name="email"
                      label="Email (Optional)"
                      variant="outlined"
                      fullWidth
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
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
