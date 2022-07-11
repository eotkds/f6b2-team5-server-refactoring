import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateScheduleInput {
  @Field(() => String)
  scheduleName: string;

  @Field(() => String)
  scheduleContents: string;

  @Field(() => Date)
  scheduleDate: Date;

  @Field(() => String)
  processCategoryId: string;

  @Field(() => String)
  projectId: string;
}
