import { AppDataSource } from "./data-source"
import { CourseModule } from "./entity/CourseModule"
// express
import * as express from "express"
import * as cors from "cors"

AppDataSource.initialize().then(async () => {

    // Create example courseModule then delete it and log every step
    const courseModule = new CourseModule()
    courseModule.courseName = "Test CourseModule"
    courseModule.courseCode = "TC"
    courseModule.courseModule = "0001"
    console.log("Saving courseModule...")
    await AppDataSource.manager.save(courseModule)
    console.log("CourseModule saved!")
    console.log("Deleting courseModule...")
    await AppDataSource.manager.remove(courseModule)

    const port = 3000
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
        res.send("Hello EPOK!")
    })

    // Create courseModule route
    app.post("/courseModule", async (req, res) => {
        if (!req.body.courseName || !req.body.courseCode || !req.body.courseModule) {
            res.status(400).send("Missing parameters")
            return
        }

        const courseModule = new CourseModule()
        courseModule.courseName = req.body.courseName
        courseModule.courseCode = req.body.courseCode
        courseModule.courseModule = req.body.courseModule
        await AppDataSource.manager.save(courseModule)
        res.send(courseModule)
    })

    // Get active modules by courseCode route
    app.get("/courseCode/:courseCode", async (req, res) => {
        const courseCode = req.params.courseCode
        const courseModules = await AppDataSource.manager.find(CourseModule, { where: { courseCode: courseCode, active: true } })
        res.send(courseModules)
    })

    // Get all courses route
    app.get("/courseModule", async (req, res) => {
        const courses = await AppDataSource.manager.find(CourseModule)
        res.send(courses)
    })

    // Get course by courseCode route
    app.get("/courseModule/:courseCode", async (req, res) => {
        const course = await AppDataSource.manager.findOne(CourseModule, { where: { courseCode: req.params.courseCode } })
        res.send(course)
    })



    app.listen(port, () => {
        console.log(`Example app listening on port ${port}!`)
    })

}).catch(error => console.log(error))
