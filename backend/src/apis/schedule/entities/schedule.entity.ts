import { Field, ObjectType } from '@nestjs/graphql';
import { ProcessCategory } from 'src/apis/processCategory/entities/processCategory.entity';
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
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  scheduleId: string;

  @Column()
  @Field(() => String)
  scheduleName: string;

  @Column()
  @Field(() => String)
  scheduleContents: string;

  @Column()
  @Field(() => Date)
  scheduleDate: Date;

  @Column({ default: true })
  @Field(() => Boolean)
  status: boolean;

  @ManyToOne(() => ProcessCategory, { onDelete: 'CASCADE' })
  @Field(() => ProcessCategory)
  processCategory: ProcessCategory;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @Field(() => Project)
  project: Project;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
