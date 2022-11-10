import { AppDataSource } from "./data-source"
import { StudyResult } from "./entity/StudyResult"
// express
import * as express from "express"
import * as cors from "cors"

AppDataSource.initialize().then(async () => {

    // Create example course then delete it and log every step
    const studyResult = new StudyResult()
    studyResult.courseCode = "TC"
    studyResult.date = "2019-12-12"
    studyResult.email = "jondoe-0@student.ltu.se"
    studyResult.grade = "A"
    studyResult.name = "Test Student"
    studyResult.socialSecurity = "1234567890"
    studyResult.status = "Passed"
    studyResult.studyModule = "Test Course"
    console.log("Saving studyResult...")
    await AppDataSource.manager.save(studyResult)
    console.log("StudyResult saved!")
    console.log("Deleting studyResult...")
    await AppDataSource.manager.remove(studyResult)

    const port = 3001
    const app = express()

    app.use(
        cors({
            origin: (origin, callback) => {
                callback(null, true);
            }
        })
    );

    app.get("/", (req, res) => {
        res.send("Hello LADOK!")
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    })

}).catch(error => console.log(error))
