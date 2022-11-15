import { createContext, useState, useCallback, useEffect, useContext } from "react";
import { useSnackbar } from "./snackbar";

export interface StudyResult {
  id: number;
  name: string;
  courseCode: string;
  grade: string;
  examDate: Date;
  status: "draft" | "done" | "certified" | "obstacle" | "";
}

// Create context StudyResults
interface StudyResultsContext {
  studyResults: StudyResult[];
  changedStudyResults: StudyResult[];
  setChangedStudyResults: (studyResults: StudyResult[]) => void;
  saved: boolean;
  loading: boolean;
  error: Error | null;
  saveStudyResults: () => void;
  resetChanges: () => void;
}
const StudyResultsContext = createContext<StudyResultsContext | null>(null);

export const StudyResultsProvider = ({ children }: { children: React.ReactNode }) => {
  const { setSnackbar } = useSnackbar();
  const [studyResults, setStudyResults] = useState<StudyResult[]>([]);
  const [changedStudyResults, setChangedStudyResults] = useState<StudyResult[]>([]);
  const [saved, setSaved] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const saveStudyResults = useCallback(() => {
    setSnackbar({ children: "Saving...", severity: "info" });
    setSaved(true);
  }, []);

  const resetChanges = () => {
    setChangedStudyResults(studyResults);
    setSnackbar({ children: "Changes reset", severity: "info" });
  };

  useEffect(() => {
    const fetchStudyResults = async () => {
      try {
        const response = await fetch("http://localhost:3001/results");
        const data = await response.json();
        setStudyResults(data);
        setChangedStudyResults(data);
        setSnackbar({ children: "Study results loaded", severity: "success" });
      } catch (e: any) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    fetchStudyResults();
  }, []);

  useEffect(() => {
    if (JSON.stringify(changedStudyResults) !== JSON.stringify(studyResults)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [studyResults, changedStudyResults]);

  return (
    <StudyResultsContext.Provider
      value={{
        studyResults,
        changedStudyResults,
        setChangedStudyResults,
        saved,
        loading,
        error,
        saveStudyResults,
        resetChanges,
      }}
    >
      {children}
    </StudyResultsContext.Provider>
  );
};

export const useStudyResults = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return useContext(StudyResultsContext)!;
};
