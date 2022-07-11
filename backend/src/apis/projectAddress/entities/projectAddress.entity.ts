import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class ProjectAddress {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  projectAddressId: string;

  @Column({ default: '' })
  @Field(() => String)
  address: string;

  @Column({ default: '' })
  @Field(() => String)
  detailAddress: string;
}
