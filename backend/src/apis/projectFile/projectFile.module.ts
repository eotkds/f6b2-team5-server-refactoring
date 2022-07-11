import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/users.entity';
import { UserService } from '../users/user.service';
import { ProjectFile } from './entities/projectFile.entity';
import { ProjectFileResolver } from './projectFile.resolver';
import { ProjectFileService } from './projectFile.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project, //
      ProjectFile, //
      User, //
    ]),
  ],
  providers: [
    ProjectFileResolver, //
    ProjectFileService, //
    FileService, //
    UserService, //
  ],
})
export class ProjectFileModule {}
