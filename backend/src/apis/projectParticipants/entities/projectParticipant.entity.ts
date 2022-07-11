import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Project } from 'src/apis/projects/entities/project.entity';
import { User } from 'src/apis/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PARTICIPANT_POSITION_ENUM {
  LEADER = 'leader',
  MEMBER = 'member',
}

registerEnumType(PARTICIPANT_POSITION_ENUM, {
  name: 'PARTICIPANT_POSITION_ENUM',
});

@Entity()
@ObjectType()
export class ProjectParticipant {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectParticipantId: string;

  @Column({ type: 'enum', enum: PARTICIPANT_POSITION_ENUM })
  @Field(() => PARTICIPANT_POSITION_ENUM)
  position: string;

  @Column({ default: true })
  @Field(() => Boolean)
  isActivated: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' })
  @Field(() => Project)
  project: Project;
}
