import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateScheduleInput {
  @Field(() => String)
  scheduleName: string;

  @Field(() => String)
  scheduleContents: string;

  @Field(() => Date)
  scheduleDate: Date;

  @Field(() => String)
  processCategoryId: string;

  @Field(() => Boolean)
  status: boolean;
}
