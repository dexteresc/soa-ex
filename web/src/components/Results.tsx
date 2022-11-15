import { Box, Typography, SelectChangeEvent, Select, MenuItem } from "@mui/material";
import { GridColDef, GridCellParams, DataGrid, useGridApiContext } from "@mui/x-data-grid";
import { useState, useEffect, useCallback } from "react";

interface StudyResult {
  id: number;
  name: string;
  courseCode: string;
  grade: string;
  examDate: Date;
  status: "draft" | "done" | "certified" | "obstacle" | "";
}

export const useStudyResults = () => {
  const [studyResults, setStudyResults] = useState<StudyResult[]>([]);
  const [newStudyResult, setNewStudyResult] = useState<StudyResult[]>([]);
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStudyResults = useCallback(async () => {
    console.log("fetching study results");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3001/results");
      const data = await response.json();
      setStudyResults(data);
      setStudyResults(data);
      setSaved(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudyResults();
  }, [fetchStudyResults]);

  const saveStudyResults = useCallback(async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3001/reg_results", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studyResults),
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setError(error);
    } finally {
      setSaved(true);
      setLoading(false);
    }
  }, [studyResults]);

  const resetChanges = useCallback(() => {
    setStudyResults(newStudyResult);
    setSaved(true);
  }, [newStudyResult]);

  return {
    studyResults,
    loading,
    error,
    saveStudyResults,
    setSaved,
    saved,
    newStudyResult,
    setNewStudyResult,
    resetChanges,
  };
};

export default function Results() {
  const { studyResults, loading, error, setSaved } = useStudyResults();
  const [rows, setRows] = useState<StudyResult[]>([]);
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
                  ? "grey"
                  : params.value === "done"
                  ? "green"
                  : params.value === "certified"
                  ? "blue"
                  : "red",
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

  useEffect(() => {
    setRows(studyResults);
    if (JSON.stringify(rows) !== JSON.stringify(studyResults)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [studyResults, rows]);

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
          rows={rows}
          columns={columns}
          checkboxSelection
          experimentalFeatures={{
            newEditingApi: true,
          }}
          disableColumnMenu
          disableColumnFilter
        />
      )}
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
      <MenuItem value=""></MenuItem>
      <MenuItem value="draft">draft</MenuItem>
      <MenuItem value="done">done</MenuItem>
      <MenuItem value="certified">certified</MenuItem>
      <MenuItem value="obstacle">obstacle</MenuItem>
    </Select>
  );
};
