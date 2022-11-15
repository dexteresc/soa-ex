import { AppDataSource } from "./data-source";
import { Student } from "./entity/Student";
// express
import * as express from "express";
import * as cors from "cors";

AppDataSource.initialize()
  .then(async () => {
    // Create example student then delete it and log every step
    // if student with socailSecurity == 123456789 exists dont create
    const studentExists = await AppDataSource.manager.findOne(Student, {
      where: { socialSecurity: "123456789" },
    });

    if (!studentExists) {
      const student = new Student();
      student.studentId = "jondoe-0";
      student.socialSecurity = "123456789";
      student.name = "John Doe";
      console.log("Saving student...");
      await AppDataSource.manager.save(student);
      console.log("Student saved!");
    }

    const port = 3002;
    const app = express();

    app.use(express.json());

    // CORS
    app.use(
      cors({
        origin: (origin, callback) => {
          callback(null, true);
        },
      })
    );

    app.get("/", (req, res) => {
      res.send("Hello Student-ITS!");
    });

    // Create student route
    app.post("/student", async (req, res) => {
      const student = new Student();
      if (!req.body.studentId || !req.body.socialSecurity || !req.body.name) {
        res.status(400).send("Missing parameters");
        return;
      }
      student.studentId = req.body.studentId;
      student.socialSecurity = req.body.socialSecurity;
      student.name = req.body.name;
      await AppDataSource.manager.save(student);
      res.send(student);
    });

    // Get all students route
    app.get("/student", async (req, res) => {
      const students = await AppDataSource.manager.find(Student);
      res.send(students);
    });

    // Get student by socialSecurity route
    app.get("/student/:socialSecurity", async (req, res) => {
      console.log(req.params.socialSecurity);
      const student = await AppDataSource.manager.findOne(Student, {
        where: { socialSecurity: req.params.socialSecurity },
      });
      if (!student) {
        res.status(404).send("Student not found");
        return;
      }
      res.send(student);
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}!`);
    });
  })
  .catch((error) => console.log(error));
