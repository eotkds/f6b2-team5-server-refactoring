import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';

import { ProjectParticipant } from './entities/projectParticipant.entity';
import { ProjectParticipantService } from './projectParticipant.service';

@Resolver()
export class ProjectParticipantResolver {
  constructor(
    private readonly projectParticipantService: ProjectParticipantService,
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProjectParticipant])
  async fetchParticipatingUser(
    @Args('projectId') projectId: string, //
  ) {
    return await this.projectParticipantService.findParticipatingUser({
      projectId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProjectParticipant])
  async fetchParticipatingProject(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return await this.projectParticipantService.findParticipatingProject({
      userId: currentUser.id,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProjectParticipant])
  async fetchActivatedProject(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    const result = await this.projectParticipantService.findActivatedProject({
      userId: currentUser.id,
    });
    return result;
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProjectParticipant])
  async fetchInactivatedProject(
    @CurrentUser() currentUser: ICurrentUser, //
    @Args('standard') standard: string,
  ) {
    return await this.projectParticipantService.findInactivatedProject({
      userId: currentUser.id,
      standard,
    });
  }

  @Mutation(() => ProjectParticipant)
  async createParticipant(
    @Args('email') email: string, //
    @Args('projectId') projectId: string,
  ) {
    return await this.projectParticipantService.create({
      email,
      projectId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProjectParticipant)
  async updateParticipant(
    @Args('isActivated') isActivated: boolean, //
    @Args('projectParticipantId') projectParticipantId: string,
  ) {
    return await this.projectParticipantService.update({
      isActivated,
      projectParticipantId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteParticipant(
    @Args('projectParticipantId') projectParticipantId: string, //
  ) {
    return await this.projectParticipantService.delete({
      projectParticipantId,
    });
  }
}
