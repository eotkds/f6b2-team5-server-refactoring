import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProjectAddressInput {
  @Field(() => String, { nullable: true })
  address: string;

  @Field(() => String, { nullable: true })
  detailAddress: string;
}
