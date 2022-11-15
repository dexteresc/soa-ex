import { AppBar, Button, IconButton, Toolbar, Typography, useTheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useStudyResults } from "./Results";

export default function Header({ colorMode }: { colorMode: { toggleColorMode: () => void } }) {
  const { saved, studyResults, saveStudyResults, resetChanges } = useStudyResults();
  const theme = useTheme();

  return (
    <AppBar position="static" color="transparent" variant="outlined" elevation={0}>
      <Toolbar>
        <Typography flexGrow={1} variant="h1" fontSize={24}>
          Examinationsresultat
        </Typography>
        {/* Results typography */}
        <Typography sx={{ mr: 2 }} variant="body1">
          Results: {studyResults.length}
        </Typography>
        <Button variant="contained" disabled={!saved} onClick={saveStudyResults}>
          Save
        </Button>
        <Button sx={{ ml: 1 }} variant="text" disabled={!saved} onClick={resetChanges}>
          Reset
        </Button>
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
