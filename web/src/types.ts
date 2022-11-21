export interface Student {
  studentId: string;
  socialSecurity: string;
  name: string;
}

export interface StudyResult {
  id?: number;
  name: string;
  courseCode: string;
  courseModule: string;
  grade: string | null;
  examDate: Date | string | null;
  status: "draft" | "done" | "certified" | "obstacle" | null;
}

export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  modules: CourseModule[];
}

export interface CourseModule {
  id: number;
  moduleName: string;
  moduleCode: string;
  credits: number;
  course: Course;
  active: boolean;
}
