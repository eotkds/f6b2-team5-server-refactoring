import { Field, ObjectType } from '@nestjs/graphql';
import { Project } from 'src/apis/projects/entities/project.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class ProcessCategory {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  processCategoryId: string;

  @Column()
  @Field(() => String)
  processName: string;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @Field(() => Project)
  project: Project;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;
}
