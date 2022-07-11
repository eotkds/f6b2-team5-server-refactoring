import { Field, InputType } from '@nestjs/graphql';
import { ProjectAddressInput } from 'src/apis/projectAddress/dto/create.projectAddress';

@InputType()
export class CreateProjectInput {
  @Field(() => String)
  projectName: string;

  @Field(() => String)
  projectIntro: string;

  @Field(() => String)
  projectDetailIntro: string;

  @Field(() => String, { nullable: true })
  projectImageURL: string;

  @Field(() => String, { nullable: true })
  projectColor: string;

  @Field(() => Date)
  startDate: Date;

  @Field(() => Date)
  endDate: Date;

  @Field(() => ProjectAddressInput)
  projectAddress: ProjectAddressInput;
}
