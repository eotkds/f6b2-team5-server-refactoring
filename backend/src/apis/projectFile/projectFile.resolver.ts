import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import { FileService } from '../file/file.service';
import { UserService } from '../users/user.service';
import { UpdateProjectFile } from './dto/updateProjectFile.input';
import { ProjectFile } from './entities/projectFile.entity';
import { ProjectFileService } from './projectFile.service';

@Resolver()
export class ProjectFileResolver {
  constructor(
    private readonly projectFileService: ProjectFileService, //
    private readonly fileService: FileService, //
    private readonly userService: UserService, //
  ) {}

  //ProjectFile 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProjectFile)
  createProjectFile(
    @Args('filename') filename: string, //
    @Args('fileURL') fileURL: string, //
    @CurrentUser('currentUser') currentUser: ICurrentUser, //
    @Args('projectId') projectId: string, //
  ) {
    return this.projectFileService.create({
      filename,
      fileURL,
      currentUser,
      projectId,
    });
  }

  //파일 리스트 검색(Project로)
  @Query(() => [ProjectFile])
  fetchProjectFiles(
    @Args('projectId') projectId: string, //
  ) {
    return this.projectFileService.findAll({ projectId });
  }

  //projectfileId로 한 개만 찾기
  @Query(() => ProjectFile)
  fetchProjectFile(
    @Args('projectFileId') projectFileId: string, //
  ) {
    return this.projectFileService.findOne({ projectFileId });
  }

  //Projectfile DB에서 기록 soft삭제
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteProjectFile(
    @Args('projectFileId') projectFileId: string, //
    @CurrentUser('currentUser') currentUser: ICurrentUser, //
  ) {
    //파일 및 이미지를 어떻게 정리할지 정하고 추후 GCP 연계하여 삭제
    //Project가 있는지 조회
    const projectFile = await this.projectFileService.findOne({
      projectFileId,
    });
    if (!projectFile) throw new BadRequestException('요청한 파일이 없습니다.');
    //projectFile 업데이트 권한이 있는지 확인 : 작성자 확인 후 관리자 인지 확인
    if (projectFile.user.userId !== currentUser.id) {
      await this.userService.checkadmin({ userId: currentUser.id });
    }
    return this.projectFileService.delete({ projectFileId });
  }

  //Projectfile업데이트
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => ProjectFile)
  async updateProjectFile(
    @Args('projectFileId') projectFileId: string, //
    @Args('updateProjectFile') updateProjectFile: UpdateProjectFile, //
    @CurrentUser('currentUser') currentUser: ICurrentUser,
  ) {
    const projectFile = await this.projectFileService.findOne({
      projectFileId,
    });
    //projectFile 있는지 확인
    if (!projectFile) throw new BadRequestException('요청한 파일이 없습니다.');

    //projectFile 업데이트 권한이 있는지 확인 : 작성자 확인 후 관리자 인지 확인
    if (projectFile.user.userId !== currentUser.id) {
      await this.userService.checkadmin({ userId: currentUser.id });
    }

    return this.projectFileService.update({ projectFileId, updateProjectFile });
  }
}
