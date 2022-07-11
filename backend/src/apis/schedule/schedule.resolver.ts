import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import { CreateScheduleInput } from './dto/createSchedule.input';
import { UpdateScheduleInput } from './dto/updateSchedule.input';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';

@Resolver()
export class ScheduleResolver {
  constructor(
    private readonly scheduleService: ScheduleService, //
  ) {}

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Schedule])
  async fetchSchedules() {
    return await this.scheduleService.findAll();
  }

  // 세부일정 조회(카테고리ID 이용)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Schedule])
  async fetchCategorySchedules(
    @Args('processCategoryId') processCategoryId: string,
  ) {
    return await this.scheduleService.findCategory({ processCategoryId });
  }

  // 세부일정 조회(프로젝트ID 이용)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Schedule])
  async fetchProjectSchedules(
    @Args('projectId') projectId: string, //
  ) {
    return await this.scheduleService.findProject({ projectId });
  }

  // 세부일정 조회(세부일정ID 이용)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Schedule)
  async fetchSchedule(
    @Args('scheduleId') scheduleId: string, //
  ) {
    return await this.scheduleService.find({ scheduleId });
  }

  //세부일정 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Schedule)
  async createSchedule(
    @CurrentUser() currentUser: ICurrentUser,
    @Args('createScheduleInput') createScheduleInput: CreateScheduleInput, //
  ) {
    return await this.scheduleService.create({
      createScheduleInput,
      userId: currentUser.id,
    });
  }

  // 세부일정 수정
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Schedule)
  async updateSchedule(
    @Args('scheduleId') scheduleId: string, //
    @Args('updateScheduleInput') updateScheduleInput: UpdateScheduleInput, //
  ) {
    return await this.scheduleService.update({
      updateScheduleInput,
      scheduleId,
    });
  }

  // 세부일정 삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteSchedule(
    @Args('scheduleId') scheduleId: string, //
  ) {
    return await this.scheduleService.delete({ scheduleId });
  }
}
