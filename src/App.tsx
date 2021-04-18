import { useState } from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";
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
import Entries from "./Components/Entries";
import About from "./Components/About";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ToastAlert from "./Components/ToastAlert";
import { useAppSelector } from "./hooks";
import { selectDiariesAppState } from "./diariesSlice";
import { lightBlue } from "@material-ui/core/colors";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

const App = () => {
  let location = useLocation();

  const [darkState, setDarkState] = useState(true);
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

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <Box minWidth={400}>
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
                      <Route path="diaries" element={<Diaries />} />
                      <Route
                        path="diaries/:diaryId/entries"
                        element={<Entries />}
                      />
                      <Route
                        path="*"
                        element={<Navigate to="/diaries" replace={true} />}
                      />
                    </>
                  ) : (
                    <>
                      <Route path="login" element={<Login />} />
                      <Route path="signup" element={<Signup />} />
                      <Route path="about" element={<About />} />
                      <Route
                        path="*"
                        element={
                          <Navigate
                            to="login"
                            state={{ from: location }}
                            replace={true}
                          />
                        }
                      />
                    </>
                  )}
                </Routes>
              </Box>
            </Container>
          </Box>
          <ToastAlert />
        </CssBaseline>
      </ThemeProvider>
    </>
  );
};

export default App;
