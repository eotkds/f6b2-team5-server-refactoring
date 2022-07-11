import { UseGuards } from '@nestjs/common';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { createUserInput } from './dto/createUser.input';
import { User } from './entities/users.entity';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  async fetchUsers() {
    return await this.userService.findAll();
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchLoginUser(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.userService.findEmailAll({ email: currentUser.email });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => User)
  async fetchUser(
    @Args('userId') userId: string, //
  ) {
    return await this.userService.findOne({ userId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [User])
  async fetchUserEmail(@Args('userOremail') userOremail: string) {
    return await this.userService.findAny({ userOremail });
  }

  // 회원 가입
  @Mutation(() => User)
  async createUser(
    @Args('createUserInput')
    createUserInput: createUserInput, //
  ) {
    const hashedPassword = await bcrypt.hash(createUserInput.password, 10);
    createUserInput.password = hashedPassword;
    return this.userService.create({ createUserInput });
  }

  @Mutation(() => String)
  async updatePassword(
    @Args('email') email: string,
    @Args('password') password: string, //
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userService.update({
      email,
      password: hashedPassword,
    });
    return '비밀번호 변경 완료';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteUser(
    @Args('email') email: string, //
  ) {
    return await this.userService.delete({ email });
  }
}
