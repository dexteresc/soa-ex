import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class StudyResult {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    socialSecurity: string

    @Column()
    courseCode: string;

    @Column()
    courseModule: string;

    @Column()
    grade: string;

    @Column()
    date: string;

    @Column()
    status: "draft" | "done" | "certified" | "obstacle"
}