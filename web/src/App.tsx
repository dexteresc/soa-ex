import {
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
  createTheme,
} from "@mui/material";
import { createContext, useContext, useMemo } from "react";
import Header from "./components/Header";
import Results from "./components/Results";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const colorMode = useContext(ColorModeContext);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#966A1D",
          },
          secondary: {
            main: "#FFFFFF",
          },
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header colorMode={colorMode} />
      <Results />
    </ThemeProvider>
  );
}

export default App;

