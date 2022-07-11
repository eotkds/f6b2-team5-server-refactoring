import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { ProcessCategory } from './entities/processCategory.entity';
import { ProcessCategoryService } from './processCategory.service';

@Resolver()
export class ProcessCategoryResolver {
  constructor(
    private readonly processCategoryService: ProcessCategoryService,
  ) {}
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProcessCategory])
  async fetchProcessCategories(
    @Args('projectId') projectId: string, //
  ) {
    return await this.processCategoryService.findAll({ projectId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [ProcessCategory])
  async fetchprocessCategory(
    @Args('processCategoryId') processCategoryId: string, //
  ) {
    return await this.processCategoryService.findOne({ processCategoryId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProcessCategory)
  async createProcessCategory(
    @Args('processName') processName: string, //
    @Args('projectId') projectId: string,
  ) {
    return await this.processCategoryService.create({ processName, projectId });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProcessCategory)
  async updateProcessCategory(
    @Args('processName') processName: string, //
    @Args('processCategoryId') processCategoryId: string,
  ) {
    return await this.processCategoryService.update({
      processName,
      processCategoryId,
    });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteProcessCategory(
    @Args('processCategoryId') processCategoryId: string,
  ) {
    return await this.processCategoryService.delete({ processCategoryId });
  }
}
