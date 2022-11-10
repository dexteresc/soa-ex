import { AppDataSource } from "./data-source"
import { Course } from "./entity/Course"
// express
import * as express from "express"
import * as cors from "cors"

AppDataSource.initialize().then(async () => {

    // Create example course then delete it and log every step
    const course = new Course()
    course.courseName = "Test Course"
    course.courseCode = "TC"
    course.semester = "Fall 2019"
    course.alias = "test-course"
    console.log("Saving course...")
    await AppDataSource.manager.save(course)
    console.log("Course saved!")
    console.log("Deleting course...")
    await AppDataSource.manager.remove(course)

    const port = 3000
    const app = express()

    app.use(
        cors({
            origin: (origin, callback) => {
                callback(null, true);
            }
        })
    );

    app.get("/", (req, res) => {
        res.send("Hello EPOK!")
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    })

}).catch(error => console.log(error))
