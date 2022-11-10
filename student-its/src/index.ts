import { AppDataSource } from "./data-source"
import { Student } from "./entity/Student"
// express
import * as express from "express"
import * as cors from "cors"

AppDataSource.initialize().then(async () => {

    // Create example student then delete it and log every step
    const student = new Student()
    student.firstName = "Test"
    student.lastName = "Student"
    student.studentId = "jondoe-0"
    student.socialSecurity = "1234567890"
    console.log("Saving student...")
    await AppDataSource.manager.save(student)
    console.log("Student saved!")
    console.log("Deleting student...")
    await AppDataSource.manager.remove(student)

    const port = 3002
    const app = express()

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

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    })

}).catch(error => console.log(error))
