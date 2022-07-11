import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class InputProjectFile {
  @Field(() => String)
  filename: string;

  @Field(() => String)
  fileURL: string;

  @Field(() => String)
  user: string;

  @Field(() => String)
  project: string;
}

@InputType()
export class UpdateProjectFile extends PartialType(InputProjectFile) {}
