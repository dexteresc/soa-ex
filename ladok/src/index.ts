import { AppDataSource } from "./data-source";
import { StudyResult } from "./entity/StudyResult";
import * as express from "express";
const fetch = require("node-fetch");
import * as cors from "cors";

AppDataSource.initialize()
  .then(async () => {
    // Create example course then delete it and log every step
    const studyResult = new StudyResult();
    studyResult.courseCode = "TC";
    studyResult.date = "2019-12-12";
    studyResult.grade = "A";
    studyResult.socialSecurity = "1234567890";
    studyResult.status = "done";
    studyResult.courseModule = "0001";
    console.log("Saving studyResult...");
    await AppDataSource.manager.save(studyResult);
    console.log("StudyResult saved!");
    console.log("Deleting studyResult...");
    await AppDataSource.manager.remove(studyResult);

    const port = 3001;
    const app = express();

    app.use(
      cors({
        origin: (origin, callback) => {
          callback(null, true);
        },
      })
    );

    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Hello LADOK!");
    });

    app.post("/reg_results", async (req, res) => {
      try {
        if (
          !req.body ||
          !req.body.socialSecurity ||
          !req.body.courseCode ||
          !req.body.courseModule ||
          !req.body.date ||
          !req.body.grade
        ) {
          res.status(400).send("Missing parameters");
          return;
        }
        const { socialSecurity, courseCode, courseModule, date, grade } =
          req.body;
        // Verify that the student exists from http://localhost:3002/student
        const student = await fetch(
          `http://localhost:3002/student/${socialSecurity}`
        )
          .then((res) => {
            return res.json();
          })
          .catch((err) => {
            console.log(err);
          });
        if (student) {
          // Verify that the course exists from http://localhost:3000/courseModule
          const course = await fetch(
            `http://localhost:3000/courseModule/${courseCode}`
          )
            .then((res) => res.json())
            .catch((err) => {
              console.log(err);
            });
          if (course) {
            // Create studyResult
            const studyResult = new StudyResult();
            studyResult.courseCode = courseCode;
            studyResult.date = date;
            studyResult.grade = grade;
            studyResult.socialSecurity = socialSecurity;
            studyResult.status = "done";
            studyResult.courseModule = courseModule;
            await AppDataSource.manager.save(studyResult);
            res.send(studyResult);
          } else {
            res.send("Course does not exist");
          }
        } else {
          res.send("Student does not exist");
          return;
        }
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }
    });

    app.get("/results", async (req, res) => {
      try {
        const studyResults = await AppDataSource.manager.find(StudyResult);
        const responseObject = [];
        for (const studyResult of studyResults) {
          const student = await fetch(
            `http://localhost:3002/student/${studyResult.socialSecurity}`
          )
            .then((res) => res.json())
            .catch((err) => {
              console.log(err);
            });

          responseObject.push({
            id: studyResult.id,
            courseCode: studyResult.courseCode,
            name: student.name,
            grade: studyResult.grade,
            examDate: studyResult.date,
            status: studyResult.status,
          });
        }
        res.send(responseObject);
      } catch (err) {
        console.log(err);
        res.status(500).send(err);
        return;
      }
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  })
  .catch((error) => console.log("catch:", error));
