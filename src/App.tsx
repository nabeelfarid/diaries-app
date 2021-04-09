import { useEffect, useState } from "react";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import {
  AppBar,
  IconButton,
  Toolbar,
  Typography,
  Box,
  Container,
  Switch,
  Tooltip,
} from "@material-ui/core";
import { GitHub } from "@material-ui/icons";
import Diaries from "./Components/Diaries";
import About from "./Components/About";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import { useAppSelector } from "./hooks";
import { selectDiariesAppState } from "./diariesSlice";
import { lightBlue } from "@material-ui/core/colors";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

const App = () => {
  const [darkState, setDarkState] = useState(true);
  // const palletType = darkState ? "dark" : "light";
  const lightPallet: PaletteOptions = {
    type: "light",
  };
  const darkPallet: PaletteOptions = {
    type: "dark",
    primary: lightBlue,
  };
  const theme = createMuiTheme({
    palette: darkState ? darkPallet : lightPallet,
  });

  const { isAuthenticated } = useAppSelector(selectDiariesAppState);

  const handleThemeChange = () => {
    setDarkState(!darkState);
  };

  useEffect(() => {
    const callDiariesApi = async () => {
      // let response = await fetch("/api/diaries/1", {
      //   method: "DEL",
      // });
      // let data = await response.json();
      // console.log("deleted diary", data);
      // response = await fetch("/api/diaries/2", {
      //   method: "PUT",
      //   body: JSON.stringify({ title: "an updated diary" }),
      // });
      // data = await response.json();
      // console.log("updated diary", data);
      // response = await fetch("/api/diaries/", {
      //   method: "POST",
      //   body: JSON.stringify({ title: "a new diary" }),
      // });
      // data = await response.json();
      // console.log("new diary", data);
      // let response = await fetch("/api/diaries/");
      // let data = await response.json();
      // console.log("all diaries", data);
    };
    callDiariesApi();
  }, []);
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <AppBar position="relative" color="inherit">
            <Toolbar>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                style={{ color: "inherit", textDecoration: "inherit" }}
              >
                Diaries App
              </Typography>
              <Box flexGrow={1} />
              <Tooltip title="Toggle dark/light theme">
                <Switch checked={darkState} onChange={handleThemeChange} />
              </Tooltip>
              <Tooltip title="Github Repo">
                <IconButton
                  aria-label="github"
                  href="https://github.com/nabeelfarid/diaries-app"
                  target="blank"
                >
                  <GitHub />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <Container>
            <Box mt={4}>
              <Routes>
                {isAuthenticated ? (
                  <>
                    <Route
                      path="/login"
                      element={<Navigate to="/" replace={true} />}
                    />
                    <Route
                      path="/signup"
                      element={<Navigate to="/" replace={true} />}
                    />
                    <Route path="/" element={<Diaries />} />
                  </>
                ) : (
                  <>
                    <Route path="login" element={<Login />} />
                    <Route path="signup" element={<Signup />} />
                    <Route path="about" element={<About />} />
                    <Route
                      path="*"
                      element={<Navigate to="login" replace={true} />}
                    />
                  </>
                )}
              </Routes>
            </Box>
          </Container>
        </CssBaseline>
      </ThemeProvider>
    </>
  );
};

export default App;
