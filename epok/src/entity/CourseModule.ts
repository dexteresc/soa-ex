import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  ManyToOne,
} from "typeorm";
import { Course } from "./Course";

@Entity()
export class CourseModule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  moduleName: string;

  @Column()
  moduleCode: string;

  @Column()
  credits: string;

  @ManyToOne((type) => Course, (course) => course.modules)
  course: Course;

  @Column({
    default: true,
  })
  active: boolean;
}
