import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  studentId: string;

  @Column({ unique: true })
  socialSecurity: string;

  @Column()
  name: string;
}
