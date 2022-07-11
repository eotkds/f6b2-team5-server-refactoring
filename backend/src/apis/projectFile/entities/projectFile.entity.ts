import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/apis/projects/entities/project.entity';
import { User } from 'src/apis/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProjectFile {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectFileId: string;

  @Column()
  @Field(() => String)
  filename: string;

  @Column()
  @Field(() => String)
  fileURL: string;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @Field(() => Project)
  project: Project;
}
