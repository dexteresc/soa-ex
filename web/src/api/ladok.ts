import { Course, CourseModule, StudyResult } from "../types";
import { get, post } from "./util";

const url = "http://localhost:3001";

export const getResults = async () => await get<StudyResult[]>(`${url}/results`);

export const regResults = async (results: StudyResult[]) => await post<StudyResult[]>(`${url}/reg_results`, results);

// Get results by courseModule
export const getResultsByCourseModule = async (
  courseCode: Course["courseCode"],
  courseModule: CourseModule["moduleCode"]
) => await get<StudyResult[]>(`${url}/results/${courseCode}/module/${courseModule}`);
