import { Alert, AlertProps, Snackbar } from "@mui/material";
import { createContext, useState, useContext } from "react";

interface SnackbarContext {
  setSnackbar: (snackbar: Pick<AlertProps, "children" | "severity"> | null) => void;
}

const SnackbarContext = createContext<SnackbarContext | null>(null);

export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackbar, setSnackbar] = useState<Pick<AlertProps, "children" | "severity"> | null>(null);
  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  return (
    <SnackbarContext.Provider value={{ setSnackbar }}>
      {children}
      {!!snackbar && (
        <Snackbar
          open
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          onClose={handleCloseSnackbar}
          autoHideDuration={6000}
        >
          <Alert {...snackbar} onClose={handleCloseSnackbar}>
            {snackbar.children}
          </Alert>
        </Snackbar>
      )}
    </SnackbarContext.Provider>
  );
};

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSnackbar = () => useContext(SnackbarContext)!;
