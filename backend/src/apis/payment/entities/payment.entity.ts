import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

//220514 환불기능은 없으나 추후 변동사항 있을 수도 있어, CANCEL 추가
export enum PAYMENT_TRANSACTION_STATUS_ENUM {
  PAYMENT = 'PAYMENT',
  CANCEL = 'CANCEL',
}

registerEnumType(PAYMENT_TRANSACTION_STATUS_ENUM, {
  name: 'PAYMENT_TRANSACTION_STATUS_ENUM',
});

@Entity()
@ObjectType()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  paymentId: string;

  @Column()
  @Field(() => String)
  impUid: string;

  @Column()
  @Field(() => Int)
  amount: number;

  @Column()
  @Field(() => String)
  product_name: string;

  @Column({ type: 'enum', enum: PAYMENT_TRANSACTION_STATUS_ENUM })
  @Field(() => PAYMENT_TRANSACTION_STATUS_ENUM)
  status: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
