import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CourseModule } from "./CourseModule";

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  courseCode: string;

  @Column()
  courseName: string;

  @OneToMany((type) => CourseModule, (courseModule) => courseModule.course, {
    cascade: true,
  })
  modules: CourseModule[];
}
