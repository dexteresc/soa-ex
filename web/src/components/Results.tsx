import {
  Box,
  Typography,
  SelectChangeEvent,
  Select,
  MenuItem,
  Modal,
  Autocomplete,
  TextField,
  IconButton,
  Button,
  Paper,
  SpeedDialIcon,
  SpeedDial,
  SpeedDialAction,
  Backdrop,
} from "@mui/material";
import { GridColDef, GridCellParams, DataGrid, useGridApiContext } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback, useState } from "react";
import { useStudyResults, StudyResult } from "../contexts/study-results";
import SchoolIcon from "@mui/icons-material/School";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CloseIcon from "@mui/icons-material/Close";
import TaskIcon from "@mui/icons-material/Task";

export default function Results() {
  const { setChangedStudyResults, changedStudyResults, loading, error, studyResults } = useStudyResults();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>();
  const [actionOpen, setActionOpen] = useState(false);
  const actions = [
    { icon: <TaskIcon />, name: "Lägg till resultat", onClick: () => openAddResult() },
    { icon: <PersonAddIcon />, name: "Lägg till student", onClick: () => openAddStudent() },
    { icon: <SchoolIcon />, name: "Lägg till kurs", onClick: () => openAddCourse() },
  ];

  const handleActionClose = () => {
    setActionOpen(false);
  };

  const openAddResult = () => {
    console.log("Add result");
    setModalOpen(true);
    setModalContent(
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4">Lägg till nytt resultat</Typography>
          {/* close button */}
          <IconButton
            size="small"
            color="secondary"
            aria-label="close"
            onClick={() => setModalOpen(false)}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Student name */}
        <Autocomplete
          options={studyResults.map((result) => result.name)}
          getOptionLabel={(option) => option}
          renderInput={(params) => <TextField {...params} label="Student" required />}
        />
        {/* Course code */}
        <Autocomplete
          options={studyResults.map((result) => result.courseCode)}
          getOptionLabel={(option) => option}
          renderInput={(params) => <TextField {...params} label="Kurskod" required />}
        />
        {/* Grade */}
        <Autocomplete
          options={studyResults.map((result) => result.grade)}
          getOptionLabel={(option) => option}
          renderInput={(params) => <TextField {...params} label="Omdöme" required />}
        />
        {/* Exam date */}
        <DatePicker
          label="Examinationsdatum"
          value={null}
          onChange={() => {}}
          renderInput={(params) => <TextField {...params} />}
        />
        {/* Status */}
        <Select defaultValue="draft">
          <MenuItem value="draft">draft</MenuItem>
          <MenuItem value="done">done</MenuItem>
          <MenuItem value="certified">certified</MenuItem>
          <MenuItem value="obstacle">obstacle</MenuItem>
        </Select>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" color="secondary" onClick={() => setModalOpen(false)}>
            Avbryt
          </Button>
          <Button variant="contained" color="primary" onClick={() => setModalOpen(false)}>
            Spara
          </Button>
        </Box>
      </Paper>
    );
  };

  const openAddStudent = () => {
    // TODO
  };

  const openAddCourse = () => {
    // TODO
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70, editable: false },
    { field: "courseCode", headerName: "Kurskod", width: 130, editable: false },
    { field: "name", headerName: "Namn", width: 200, editable: false, flex: 1 },
    { field: "grade", headerName: "Omdöme", width: 100, editable: true },
    { field: "examDate", headerName: "Examinationsdatum", width: 150, editable: true },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      editable: true,
      renderCell: (params: GridCellParams) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Box
            sx={{
              backgroundColor:
                params.value === "draft"
                  ? "#bf7d3a" // draft
                  : params.value === "done"
                  ? "#3abf3a" // green
                  : params.value === "certified"
                  ? "#3abfbf" // blue
                  : "#bf3a3a", // red
              color: "primary.contrastText",
              padding: "0.2rem 0.5rem",
              borderRadius: "0.5rem",
            }}
          >
            {params.value}
          </Box>
        </Box>
      ),
      renderEditCell: (params: GridCellParams) => <SelectEditCell {...params} />,
    },
  ];

  const processRowUpdate = useCallback(
    (newRow: StudyResult) => {
      const newRows = changedStudyResults.map((row) => {
        if (row.id === newRow.id) {
          return newRow;
        }
        return row;
      });
      setChangedStudyResults(newRows);
      return newRow;
    },
    [changedStudyResults]
  );

  return (
    <Box
      className="transition"
      sx={
        loading
          ? {
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }
          : { height: "calc(100vh - 64px)" }
      }
    >
      {error ? (
        <Typography variant="h4" color="error">
          {error.message}
        </Typography>
      ) : loading ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 38 38" stroke="#000">
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)" strokeWidth="2">
              <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
              <path d="M36 18c0-9.94-8.06-18-18-18">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 18 18"
                  to="360 18 18"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </g>
        </svg>
      ) : (
        <DataGrid
          rows={changedStudyResults}
          columns={columns}
          checkboxSelection
          experimentalFeatures={{
            newEditingApi: true,
          }}
          disableColumnMenu
          disableColumnFilter
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={console.log}
        />
      )}
      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          {modalContent ? modalContent : <Typography variant="h4">Modal content</Typography>}
        </Modal>
      )}
      <Box sx={{ height: 330, flexGrow: 1 }}>
        <Backdrop open={actionOpen} />
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          sx={{ position: "absolute", bottom: 69, right: 16 }}
          icon={<SpeedDialIcon />}
          onClose={() => setActionOpen(false)}
          onOpen={() => {
            setActionOpen(true);
          }}
          open={actionOpen}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              tooltipOpen
              onClick={() => action.onClick()}
            />
          ))}
        </SpeedDial>
      </Box>
    </Box>
  );
}

const SelectEditCell = ({ id, field, value }: GridCellParams) => {
  const apiRef = useGridApiContext();
  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };
  return (
    <Select value={value} defaultOpen onChange={handleChange}>
      <MenuItem value="draft">draft</MenuItem>
      <MenuItem value="done">done</MenuItem>
      <MenuItem value="certified">certified</MenuItem>
      <MenuItem value="obstacle">obstacle</MenuItem>
    </Select>
  );
};
