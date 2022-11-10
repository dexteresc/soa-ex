import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Student {

    @PrimaryGeneratedColumn()
    id: number

    // Unique Column
    @Column({ unique: true })
    studentId: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    socialSecurity: string
}
