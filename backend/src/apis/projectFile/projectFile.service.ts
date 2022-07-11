import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileService } from '../file/file.service';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/users.entity';
import { ProjectFile } from './entities/projectFile.entity';

@Injectable()
export class ProjectFileService {
  constructor(
    @InjectRepository(ProjectFile)
    private readonly projectFileRepository: Repository<ProjectFile>, //

    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //

    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>, //
  ) {}
  async create({ filename, fileURL, currentUser, projectId }) {
    const user = await this.userRepository.findOne({
      where: {
        userId: currentUser.id,
      },
    });
    const project = await this.projectRepository.findOne({
      where: {
        projectId: projectId,
      },
    });
    const result = await this.projectFileRepository.save({
      filename,
      fileURL,
      user: user,
      project: project,
    });
    return result;
  }

  async findAll({ projectId }) {
    const results = await this.projectFileRepository
      .createQueryBuilder('ProjectFile')
      .leftJoinAndSelect('ProjectFile.project', 'projectId')
      .leftJoinAndSelect('ProjectFile.user', 'userId')
      .where('ProjectFile.project = :projectId', { projectId })
      .getMany();

    return results;
  }

  async findOne({ projectFileId }) {
    const result = await this.projectFileRepository
      .createQueryBuilder('projectFile')
      .leftJoinAndSelect('projectFile.project', 'projectId')
      .leftJoinAndSelect('projectFile.user', 'userId')
      .where('projectFile.projectFileId = :projectFileId', { projectFileId })
      .getOne();

    return result;
  }

  async delete({ projectFileId }) {
    const result = await this.projectFileRepository.softDelete({
      projectFileId,
    });
    return result.affected ? true : false;
  }

  async update({ projectFileId, updateProjectFile }) {
    await this.projectFileRepository
      .createQueryBuilder()
      .update('ProjectFile')
      .set({ ...updateProjectFile })
      .where('projectFileId = :projectFileId', { projectFileId })
      .execute();

    const result = await this.projectFileRepository
      .createQueryBuilder('ProjectFile')
      .leftJoinAndSelect('ProjectFile.user', 'userId')
      .leftJoinAndSelect('ProjectFile.project', 'projectId')
      .where('ProjectFile.projectFileId = :projectFileId', { projectFileId })
      .getOne();
    return result;
  }
}
