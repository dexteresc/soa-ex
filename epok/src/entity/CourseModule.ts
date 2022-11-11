import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class CourseModule {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    courseCode: string

    @Column()
    courseName: string

    @Column()
    courseModule: string

    @Column({
        default: "true"
    })
    active: boolean
}

