import { Field, ObjectType } from '@nestjs/graphql';
import { ProjectAddress } from 'src/apis/projectAddress/entities/projectAddress.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectId: string;

  @Column()
  @Field(() => String)
  projectName: string;

  @Column()
  @Field(() => String)
  projectIntro: string;

  @Column()
  @Field(() => String)
  projectDetailIntro: string;

  @Column({ default: 'https://i.ibb.co/qM8kvDM/smaf.png' })
  @Field(() => String)
  projectImageURL: string;

  @Column()
  @Field(() => Date)
  startDate: Date;

  @Column()
  @Field(() => Date)
  endDate: Date;

  @Column({ default: true })
  @Field(() => Boolean)
  status: boolean;

  @Column({ default: '#FF8B8B' })
  @Field(() => String)
  projectColor: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;

  // 1:1 관계(프로젝트 장소)
  @JoinColumn()
  @OneToOne(() => ProjectAddress)
  @Field(() => ProjectAddress)
  address: ProjectAddress;
}
