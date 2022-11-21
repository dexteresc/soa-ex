import { Course, CourseModule } from "../types";
import { get } from "./util";
const url = "http://localhost:3000";

// Get all course modules
export const getCourses = async () => await get<Course[]>(`${url}/courses`);

// Get course module by course code
export const getCourseModuleByCode = async (courseCode: string) =>
  await get<CourseModule[]>(`${url}/course/${courseCode}/modules`);
