import { AppDataSource } from "./data-source";
import { CourseModule } from "./entity/CourseModule";
// express
import * as express from "express";
import * as cors from "cors";
import { Course } from "./entity/Course";

AppDataSource.initialize()
  .then(async () => {
    // if the three courses are not in the database, add them
    const courseRepository = AppDataSource.getRepository(Course);
    const courses = await courseRepository.find();
    if (courses.length === 0) {
      // Create 3 example courses with 3 modules each
      const course1 = new Course();
      course1.courseCode = "CSC1001";
      course1.courseName = "Introduction to Computer Science";
      const course2 = new Course();
      course2.courseCode = "D0013E";
      course2.courseName = "Introduction to Programming";
      const course3 = new Course();
      course3.courseCode = "D0014E";
      course3.courseName = "Introduction to Software Engineering";
      const courseModules = [
        new CourseModule(),
        new CourseModule(),
        new CourseModule(),
      ];
      courseModules[0].moduleName = "Creating a Web Page";
      courseModules[0].moduleCode = "0001";
      courseModules[0].credits = "7.5";
      courseModules[0].active = true;
      courseModules[1].moduleName = "Creating a CRM";
      courseModules[1].moduleCode = "0002";
      courseModules[1].credits = "7.5";
      courseModules[1].active = true;
      courseModules[2].moduleName = "Exam Preparation";
      courseModules[2].moduleCode = "0003";
      courseModules[2].credits = "7.5";
      courseModules[2].active = false;
      course1.modules = courseModules;
      const courseModules2 = [
        new CourseModule(),
        new CourseModule(),
        new CourseModule(),
      ];
      courseModules2[0].moduleName = "Creating a Web Page";
      courseModules2[0].moduleCode = "0001";
      courseModules2[0].credits = "7.5";
      courseModules2[0].active = true;
      courseModules2[1].moduleName = "Creating a CRM";
      courseModules2[1].moduleCode = "0002";
      courseModules2[1].credits = "7.5";
      courseModules2[1].active = true;
      courseModules2[2].moduleName = "Exam Preparation";
      courseModules2[2].moduleCode = "0003";
      courseModules2[2].credits = "7.5";
      courseModules2[2].active = false;
      course2.modules = courseModules2;
      const courseModules3 = [
        new CourseModule(),
        new CourseModule(),
        new CourseModule(),
      ];
      courseModules3[0].moduleName = "Creating a Web Page";
      courseModules3[0].moduleCode = "0001";
      courseModules3[0].credits = "7.5";
      courseModules3[0].active = true;
      courseModules3[1].moduleName = "Creating a CRM";
      courseModules3[1].moduleCode = "0002";
      courseModules3[1].credits = "7.5";
      courseModules3[1].active = true;
      courseModules3[2].moduleName = "Exam Preparation";
      courseModules3[2].moduleCode = "0003";
      courseModules3[2].credits = "7.5";
      courseModules3[2].active = false;
      course3.modules = courseModules3;
      await courseRepository.save(course1);
      await courseRepository.save(course2);
      await courseRepository.save(course3);
    }

    // Create express app
    const port = 3000;
    const app = express();

    app.use(express.json());

    app.use(
      cors({
        origin: (origin, callback) => {
          callback(null, true);
        },
      })
    );

    app.get("/", (req, res) => {
      res.send("Hello EPOK!");
    });

    // Add routes
    // Get modules by course code
    app.get("/course/:courseCode/modules", async (req, res) => {
      const courseCode = req.params.courseCode;
      const course = await AppDataSource.manager.findOne(Course, {
        where: { courseCode: courseCode },
        relations: ["modules"],
      });
      if (course) {
        // send active modules
        res.send(course.modules.filter((module) => module.active));
      } else {
        res.status(404).send("Course not found");
      }
    });

    // Get all courses
    app.get("/courses", async (req, res) => {
      const courses = await AppDataSource.manager.find(Course);
      res.send(courses);
    });

    app.listen(port, () => {
      console.log(`EPOK listening on port ${port}!`);
    });
  })
  .catch((error) => console.log(error));
