import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class StudyResult {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: string;

  @Column()
  courseCode: string;

  @Column()
  courseModule: string;

  @Column({
    default: null,
  })
  grade?: string;

  @Column()
  date?: string | null;

  @Column({
    default: null,
  })
  status?: "draft" | "done" | "certified" | "obstacle";
}
