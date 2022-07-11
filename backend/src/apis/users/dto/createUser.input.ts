import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class createUserInput {
  @Field(() => String)
  userName: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  phone: string;

  @Field(() => String, { nullable: true })
  userImageURL: string;
}
