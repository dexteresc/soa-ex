import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class StudyResult {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    socialSecurity: string

    @Column()
    email: string;

    @Column()
    courseCode: string;

    @Column()
    studyModule: string;

    @Column()
    grade: string;

    @Column()
    date: string;

    @Column()
    status: string;
}
