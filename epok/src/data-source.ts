import "reflect-metadata"
import { DataSource } from "typeorm"
import { CourseModule } from "./entity/CourseModule"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "epokdb",
    synchronize: true,
    logging: false,
    entities: [CourseModule],
    migrations: [],
    subscribers: [],
})
