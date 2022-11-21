import {
  AppBar,
  Autocomplete,
  Button,
  Chip,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DataGrid, GridCellParams, useGridApiContext } from "@mui/x-data-grid";
import { useCallback, useEffect, useState } from "react";
import { getCourseModuleByCode, getCourses } from "../api/epok";
import { getResultsByCourseModule, regResults } from "../api/ladok";
import { Course, CourseModule, StudyResult } from "../types";

function Results({ toggleColorMode }: { toggleColorMode: () => void }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseInputValue, setCourseInputValue] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [courseModuleInputValue, setCourseModuleInputValue] = useState("");
  const [selectedCourseModule, setSelectedCourseModule] = useState<CourseModule | null>(null);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseModuleLoading, setCourseModuleLoading] = useState(false);

  const [results, setResults] = useState<StudyResult[]>([]);
  const [changedResults, setChangedResults] = useState<StudyResult[]>([]);
  const [gridLoading, setGridLoading] = useState(false);

  const [saved, setSaved] = useState(true);

  useEffect(() => {
    setCourseLoading(true);
    getCourses().then((data) => {
      setCourses(data);
      setCourseLoading(false);
      console.log("Courses:", data);
    });
  }, []);

  useEffect(() => {
    // Fetch modules for course
    setCourseModules([]);
    setCourseModuleLoading(true);
    if (selectedCourse) {
      getCourseModuleByCode(selectedCourse.courseCode).then((data) => {
        setCourseModules(data);
        setCourseModuleLoading(false);
        console.log("CourseModules:", data);
      });
    } else {
      setCourseModuleInputValue("");
      setSelectedCourseModule(null);
    }
  }, [selectedCourse]);

  const handleViewResults = () => {
    if (selectedCourseModule?.moduleCode && selectedCourse?.courseCode) {
      setGridLoading(true);
      getResultsByCourseModule(selectedCourse.courseCode, selectedCourseModule.moduleCode).then((data) => {
        const newData = data.map((result) => {
          return {
            ...result,
            examDate: result.examDate ? new Date(result.examDate) : null,
          };
        });

        setResults(newData);
        setChangedResults(newData);
        setGridLoading(false);
        console.log("Results:", newData);
      });
    }
  };

  const processRowUpdate = useCallback(
    (newRow: StudyResult) => {
      const newRows = changedResults.map((row) => {
        if (row.id === newRow.id) {
          return newRow;
        }
        return row;
      });
      setChangedResults(newRows);
      return newRow;
    },
    [changedResults]
  );

  const onProcessRowUpdateError = (error: any) => {
    console.log("Error:", error);
  };

  useEffect(() => {
    console.log("changedResults:", changedResults);
  }, [changedResults]);

  const handleSave = () => {
    console.log("Save:", changedResults);
    // transform data
    const transformedData: StudyResult[] = changedResults.map((result) => {
      return {
        ...result,
        examDate: typeof result.examDate === "string" ? result.examDate : result.examDate?.toISOString() || "",
      };
    });
    setGridLoading(true);

    regResults(transformedData).then((data) => {
      console.log("Save result:", data);
      setGridLoading(false);
      setSaved(true);
    });
  };

  // Check for changes
  useEffect(() => {
    if (results.length === changedResults.length) {
      const changed = results.some((result, index) => {
        return result.examDate !== changedResults[index].examDate;
      });
      setSaved(!changed);
    } else {
      setSaved(false);
    }
  }, [results, changedResults]);

  return (
    <>
      <Box
        component="aside"
        width="300px"
        position="fixed"
        left={0}
        height="100vh"
        sx={{ borderRight: 1, borderColor: "divider", padding: 2, boxSizing: "border-box" }}
      >
        <Box component="form">
          <Typography variant="h1" fontSize="24px" fontWeight="500" marginBottom={4}>
            Courses
          </Typography>
          <Autocomplete
            fullWidth
            value={selectedCourse}
            onChange={(event: any, newValue: Course | null) => {
              setSelectedCourse(newValue);
            }}
            inputValue={courseInputValue}
            onInputChange={(event, newInputValue) => {
              setCourseInputValue(newInputValue);
            }}
            options={courses}
            getOptionLabel={(option) => option.courseCode}
            renderInput={(params) => <TextField {...params} label="Kurs" variant="outlined" />}
            sx={{ marginBottom: 2 }}
            loading={courseLoading}
          />
          <Autocomplete
            fullWidth
            value={selectedCourseModule}
            onChange={(event: any, newValue: CourseModule | null) => {
              setSelectedCourseModule(newValue);
            }}
            inputValue={courseModuleInputValue}
            onInputChange={(event, newInputValue) => {
              setCourseModuleInputValue(newInputValue);
            }}
            options={courseModules}
            getOptionLabel={(option) => option.moduleCode + " - " + option.moduleName}
            renderInput={(params) => <TextField {...params} label="Kursmodul" variant="outlined" />}
            disabled={courseModules.length === 0 || selectedCourse === null}
            sx={{ marginBottom: 2 }}
            loading={courseModuleLoading}
          />
          <Button
            fullWidth
            variant="contained"
            disabled={selectedCourseModule === null}
            sx={{ marginBottom: 2 }}
            onClick={handleViewResults}
          >
            Visa resultat
          </Button>
        </Box>
      </Box>
      <Box component="main" sx={{ marginLeft: "300px", display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* App bar with title save and reset btn */}
        <AppBar position="static" variant="outlined" color="transparent" sx={{ borderLeft: "none" }} elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Resultat
            </Typography>
            {/* Save changes */}
            <Button variant="contained" color="primary" sx={{ marginRight: 2 }} onClick={handleSave} disabled={saved}>
              Spara
            </Button>
            {/* Reset changes */}
            <Button color="error" sx={{ marginRight: 2 }} onClick={() => setChangedResults(results)} disabled={saved}>
              Återställ
            </Button>

            <Button color="inherit" onClick={toggleColorMode}>
              Ändra tema
            </Button>
          </Toolbar>
        </AppBar>
        <DataGrid
          rows={results}
          columns={[
            { field: "id", headerName: "ID", width: 70 },
            { field: "name", headerName: "Namn", width: 200, flex: 1 },
            { field: "grade", headerName: "Betyg", width: 100, editable: true },
            {
              field: "examDate",
              headerName: "Examinationsdatum",
              width: 200,
              editable: true,
              type: "date",
              // Turn into date
              valueFormatter: (params) => {
                return params.value ? new Date(params.value).toLocaleDateString() : "";
              },
              valueGetter: (params) => {
                if (params.value) {
                  // if date turn into string
                  return new Date(params.value).toISOString();
                } else return "";
              },
            },
            {
              field: "status",
              headerName: "Status",
              width: 150,
              // render cell with different color depending on status "draft" | "done" | "certified" | "obstacle"
              renderCell: (params) => {
                return params.value ? (
                  <Chip
                    label={
                      params.value === "draft"
                        ? "Utkast"
                        : params.value === "done"
                        ? "Klar"
                        : params.value === "certified"
                        ? "Certifierad"
                        : "Hinder"
                    }
                    color={params.value === "done" ? "success" : params.value === "certified" ? "primary" : "default"}
                  />
                ) : null;
              },
              editable: true,

              renderEditCell: (params) => <SelectEditCell {...params} />,
            },
          ]}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
          sx={{ flexGrow: 1, height: "100%", borderRadius: 0, border: 0 }}
          loading={gridLoading}
          experimentalFeatures={{
            newEditingApi: true,
          }}
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={onProcessRowUpdateError}
        />
      </Box>
    </>
  );
}

export default Results;

const SelectEditCell = ({ id, field, value }: GridCellParams) => {
  const apiRef = useGridApiContext();
  const handleChange = (event: SelectChangeEvent) => {
    const newValue = event.target.value;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };
  return (
    <Select value={value} defaultOpen onChange={handleChange}>
      <MenuItem value="draft">Utkast</MenuItem>
      <MenuItem value="done">Klar</MenuItem>
      <MenuItem value="certified">Certifierad</MenuItem>
      <MenuItem value="obstacle">Hinder</MenuItem>
    </Select>
  );
};
