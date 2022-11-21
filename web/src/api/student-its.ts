import { Student } from "../types";
import { get } from "./util";

const url = "http://localhost:3002";

// Get students
export const getStudents = async () => await get<Student[]>(`${url}/student`);

// Get social security number by student id
export const getSSN = async (ideal: string) => await get<Student>(`${url}/student/${ideal}`);
