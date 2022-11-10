import "reflect-metadata"
import { DataSource } from "typeorm"
import { StudyResult } from "./entity/StudyResult"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "ladokdb",
    synchronize: true,
    logging: false,
    entities: [StudyResult],
    migrations: [],
    subscribers: [],
})
