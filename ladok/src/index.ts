import { AppDataSource } from "./data-source";
import { StudyResult } from "./entity/StudyResult";
import * as express from "express";
const fetch = require("node-fetch");
import * as cors from "cors";

AppDataSource.initialize()
  .then(async () => {
    // insert 10 results for courseModule
    const studyResultRepository = AppDataSource.getRepository(StudyResult);
    const studyResults = await studyResultRepository.find();
    if (studyResults.length === 0) {
      const studyResult1 = new StudyResult();
      studyResult1.studentId = "jondoe-0";
      studyResult1.courseCode = "CSC1001";
      studyResult1.courseModule = "0001";
      studyResult1.grade = "VG";
      studyResult1.date = "2020-01-01";
      studyResult1.status = "done";
      const studyResult2 = new StudyResult();
      studyResult2.studentId = "jondoe-0";
      studyResult2.courseCode = "CSC1001";
      studyResult2.courseModule = "0002";
      studyResult2.grade = "G";
      studyResult2.date = "2020-01-01";
      studyResult2.status = "done";
      const studyResult3 = new StudyResult();
      studyResult3.studentId = "jondoe-0";
      studyResult3.courseCode = "CSC1001";
      studyResult3.courseModule = "0003";
      studyResult3.grade = "IG";
      studyResult3.date = "2020-01-01";
      studyResult3.status = "done";
      const studyResult4 = new StudyResult();
      studyResult4.studentId = "jondoe-0";
      studyResult4.courseCode = "D0013E";
      studyResult4.courseModule = "0001";
      studyResult4.grade = "VG";
      studyResult4.date = "2020-01-01";
      studyResult4.status = "done";
      const studyResult5 = new StudyResult();
      studyResult5.studentId = "jondoe-0";
      studyResult5.courseCode = "D0013E";
      studyResult5.courseModule = "0002";
      studyResult5.grade = "G";
      studyResult5.date = "2020-01-02";
      studyResult5.status = "done";
      // 10 results without grade with new social security
      const studyResult6 = new StudyResult();
      studyResult6.studentId = "foobar-0";
      studyResult6.courseCode = "D0013E";
      studyResult6.courseModule = "0003";
      studyResult6.date = "2020-01-03";
      const studyResult7 = new StudyResult();
      studyResult7.studentId = "foobar-0";
      studyResult7.courseCode = "D0013E";
      studyResult7.courseModule = "0001";
      studyResult7.date = "2020-01-04";
      const studyResult8 = new StudyResult();
      studyResult8.studentId = "foobar-0";
      studyResult8.courseCode = "D0013E";
      studyResult8.courseModule = "0001";
      studyResult8.date = "2020-01-05";
      const studyResult9 = new StudyResult();
      studyResult9.studentId = "foobar-0";
      studyResult9.courseCode = "D0013E";
      studyResult9.courseModule = "0001";
      studyResult9.date = "2020-01-06";
      const studyResult10 = new StudyResult();
      studyResult10.studentId = "foobar-0";
      studyResult10.courseCode = "D0013E";
      studyResult10.courseModule = "0001";
      studyResult10.date = "2020-01-07";
      const studyResult11 = new StudyResult();
      studyResult11.studentId = "foobar-0";
      studyResult11.courseCode = "D0013E";
      studyResult11.courseModule = "0002";
      studyResult11.date = "2020-01-08";

      // save
      await studyResultRepository.save([
        studyResult1,
        studyResult2,
        studyResult3,
        studyResult4,
        studyResult5,
        studyResult6,
        studyResult7,
        studyResult8,
        studyResult9,
        studyResult10,
        studyResult11,
      ]);
    }

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
        // get array of study results from request body
        const studyResults = req.body;
        // verify that the request body is an array
        if (!Array.isArray(studyResults)) {
          res.status(400).send("Request body must be an array");
          return;
        }
        // verify that the array is not empty
        if (studyResults.length === 0) {
          res.status(400).send("Request body must not be empty");
          return;
        }
        // verify that the array contains objects
        if (
          !studyResults.every((studyResult) => typeof studyResult === "object")
        ) {
          res.status(400).send("Request body must contain objects");
          return;
        }
        // verify that the objects contain the required properties
        if (
          !studyResults.every(
            (studyResult) =>
              typeof studyResult.studentId === "string" &&
              typeof studyResult.courseCode === "string" &&
              typeof studyResult.courseModule === "string" &&
              typeof studyResult.grade === "string" &&
              typeof studyResult.date === "string" &&
              typeof studyResult.status === "string"
          )
        ) {
          // log keys and types
          studyResults[0].forEach((key, value) => {
            console.log(key, typeof value);
          });
          res
            .status(400)
            .send(
              "Request body must contain objects with the required properties"
            );
          return;
        }
        // update stufy results in database
        for (let studyResult of studyResults) {
          const studyResultRepository =
            AppDataSource.getRepository(StudyResult);
          const studyResultToUpdate = await studyResultRepository.findOne({
            where: {
              studentId: studyResult.studentId,
              courseCode: studyResult.courseCode,
              courseModule: studyResult.courseModule,
            },
          });
          if (studyResultToUpdate) {
            studyResultToUpdate.grade = studyResult.grade;
            studyResultToUpdate.date = studyResult.date;
            studyResultToUpdate.status = studyResult.status;
            await studyResultRepository.save(studyResultToUpdate);
          }
        }
        // Send updated study results back to LADOK
        res.status(200).send(studyResults);
      } catch (error) {
        console.log(error);
        res.status(500).send("Internal server error");
      }
    });

    app.get("/results", async (req, res) => {
      try {
        const studyResults = await AppDataSource.manager.find(StudyResult);
        const responseObject = [];
        for (const studyResult of studyResults) {
          const student = await fetch(
            `http://localhost:3002/student/${studyResult.studentId}`
          )
            .then((res) => res.json())
            .catch((err) => {
              console.log("Error fetching student", err);
            });

          responseObject.push({
            id: studyResult.id,
            courseCode: studyResult.courseCode,
            courseModule: studyResult.courseModule,
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

    app.get("/results/:courseCode/module/:moduleCode", async (req, res) => {
      if (!req.params.courseCode || !req.params.moduleCode) {
        res.status(400).send("Missing parameters");
        return;
      }
      const { courseCode, moduleCode } = req.params;
      const studyResults = await AppDataSource.manager.find(StudyResult, {
        where: {
          courseCode,
          courseModule: moduleCode,
        },
      });
      try {
        const responseObject = [];
        for (const studyResult of studyResults) {
          const student = await fetch(
            `http://localhost:3002/student/${studyResult.studentId}`
          )
            .then((response) => response.json())
            .catch((err) => {
              console.log(err);
            });
          if (student) {
            responseObject.push({
              id: studyResult.id,
              courseCode: studyResult.courseCode,
              courseModule: studyResult.courseModule,
              name: student.name,
              grade: studyResult.grade,
              examDate: studyResult.date,
              status: studyResult.status,
            });
          } else {
            res.send("Student does not exist");
            return;
          }
        }
        res.send(responseObject);
      } catch (err) {
        res.status(500).send(err);
      }
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  })
  .catch((error) => console.log("catch:", error));
