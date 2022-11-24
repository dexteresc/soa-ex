import { AppDataSource } from "./data-source";
import { Student } from "./entity/Student";
// express
import * as express from "express";
import * as cors from "cors";

AppDataSource.initialize()
  .then(async () => {
    // Create example student then delete it and log every step
    // if student with socailSecurity == 123456789 exists dont create
    const studentExists = await AppDataSource.manager.find(Student);

    if (studentExists.length === 0) {
      const student = new Student();
      student.studentId = "jondoe-0";
      student.socialSecurity = "19900101-1234";
      student.name = "John Doe";
      const student2 = new Student();
      student2.studentId = "foobar-0";
      student2.socialSecurity = "19900101-1235";
      student2.name = "Foo Bar";

      console.log("Saving student...");

      await AppDataSource.manager.save([student, student2]);
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
        // Check if all fields are filled
        res.status(400).send("Missing parameters");
        return;
      }
      student.studentId = req.body.studentId;
      student.socialSecurity = req.body.socialSecurity;
      student.name = req.body.name;
      await AppDataSource.manager.save(student); // Save student to database
      res.send(student);
    });

    // Get all students route
    app.get("/student", async (req, res) => {
      const students = await AppDataSource.manager.find(Student);
      res.send(students);
    });

    // Get student by ideal (studentId) route
    app.get("/student/:ideal", async (req, res) => {
      const ideal = req.params.ideal;
      const student = await AppDataSource.manager.findOne(Student, {
        where: { studentId: ideal },
      });
      if (student) {
        res.send(student);
        return;
      }
      res.status(404).send("Student not found");
    });

    app.listen(port, () => {
      console.log(`Student-its API listening on port ${port}!`);
    });
  })
  .catch((error) => console.log(error));
