import { AppDataSource } from "./data-source"
import { Student } from "./entity/Student"
// express
import * as express from "express"
import * as cors from "cors"

AppDataSource.initialize().then(async () => {

    // Create example student then delete it and log every step
    const student = new Student()
    student.studentId = "jondoe-0"
    student.socialSecurity = "1234567890"
    student.name = "John Doe"
    console.log("Saving student...")
    await AppDataSource.manager.save(student)
    console.log("Student saved!")
    console.log("Deleting student...")
    await AppDataSource.manager.remove(student)

    const port = 3002
    const app = express()

    app.use(express.json())

    app.use(
        cors({
            origin: (origin, callback) => {
                callback(null, true);
            }
        })
    );

    app.get("/", (req, res) => {
        res.send("Hello Student-ITS!")
    })

    // Create student route
    app.post("/student", async (req, res) => {
        const student = new Student()
        if (!req.body.studentId || !req.body.socialSecurity || !req.body.name) {
            res.status(400).send("Missing parameters")
            return
        }
        student.studentId = req.body.studentId
        student.socialSecurity = req.body.socialSecurity
        student.name = req.body.name
        await AppDataSource.manager.save(student)
        res.send(student)
    })

    // Get all students route
    app.get("/student", async (req, res) => {
        const students = await AppDataSource.manager.find(Student)
        res.send(students)
    })

    // Get student by socialSecurity route
    app.get("/student/:socialSecurity", async (req, res) => {
        console.log(req.params.socialSecurity)
        const student = await AppDataSource.manager.findOne(Student, { where: { socialSecurity: req.params.socialSecurity } })
        res.send(student)
    })


    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    })

}).catch(error => console.log(error))
