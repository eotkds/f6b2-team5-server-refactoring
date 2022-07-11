import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  // 회원이미지 업로드
  @Mutation(() => String)
  async userImageUpload(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload, //
  ) {
    return await this.fileService.userImage({ file });
  }

  // 프로젝트이미지 업로드
  @Mutation(() => String)
  async projectImageUpload(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload, //
  ) {
    return await this.fileService.projectImage({ file });
  }

  //프로젝트 파일 업로드
  @Mutation(() => String)
  projectFileUpload(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload, //
  ) {
    return this.fileService.projectFile({ file });
  }

  //프로젝트 파일 삭제(구글 Storage에서)
  @Mutation(() => Boolean)
  deleteProjectFile(
    @Args('URL') URL: string, //
  ) {
    return this.fileService.deleteFileWithGoogle({ URL });
  }
}
