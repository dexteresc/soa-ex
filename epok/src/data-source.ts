import "reflect-metadata";
import { DataSource } from "typeorm";
import { Course } from "./entity/Course";
import { CourseModule } from "./entity/CourseModule";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "epokdb",
  synchronize: true,
  logging: false,
  entities: [Course, CourseModule],
  migrations: [],
  subscribers: [],
});
