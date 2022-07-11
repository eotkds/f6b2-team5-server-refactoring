import { InputType, OmitType } from '@nestjs/graphql';
import { createUserInput } from './createUser.input';

@InputType()
export class UpdateUserInput extends OmitType(
  createUserInput,
  ['email'],
  InputType,
) {}
