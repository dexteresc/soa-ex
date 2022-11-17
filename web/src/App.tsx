import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Results from "./components/Results";
import { SnackbarProvider } from "./contexts/snackbar";
import { StudyResultsProvider } from "./contexts/study-results";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function App() {
  const [mode, setMode] = useState<"light" | "dark">(
    (localStorage.getItem("mode") ? localStorage.getItem("mode") : "light") as "light" | "dark"
  );
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#3f51b5",
          },
          secondary: {
            main: "#f50057",
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    localStorage.setItem("mode", mode);
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <SnackbarProvider>
          <StudyResultsProvider>
            <CssBaseline />
            <Header toggleColorMode={toggleColorMode} />
            <Results />
          </StudyResultsProvider>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
