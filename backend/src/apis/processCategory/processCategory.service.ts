import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { ProcessCategory } from './entities/processCategory.entity';

@Injectable()
export class ProcessCategoryService {
  constructor(
    @InjectRepository(ProcessCategory)
    private readonly processCategoryRepository: Repository<ProcessCategory>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}
  async findAll({ projectId }) {
    const categoryies = await this.processCategoryRepository
      .createQueryBuilder('processCategory')
      .where('processCategory.project = :projectId', { projectId: projectId })
      .orderBy('processCategory.createAt', 'ASC')
      .leftJoinAndSelect('processCategory.project', 'project')
      .getMany();

    return categoryies;
  }

  async findOne({ processCategoryId }) {
    const category = await this.processCategoryRepository
      .createQueryBuilder('processCategory')
      .where('processCategory.processCategoryId = :processCategoryId', {
        processCategoryId: processCategoryId,
      })
      .orderBy('processCategory.createAt', 'ASC')
      .leftJoinAndSelect('processCategory.project', 'project')
      .getMany();

    return category;
  }

  async create({ processName, projectId }) {
    const project = await this.projectRepository.findOne({ projectId });

    const category = await this.processCategoryRepository.save({
      processName,
      project,
    });

    return category;
  }

  async update({ processName, processCategoryId }) {
    const category = await this.processCategoryRepository
      .createQueryBuilder('processCategory')
      .where('processCategory.processCategoryId = :processCategoryId', {
        processCategoryId,
      })
      .leftJoinAndSelect('processCategory.project', 'project')
      .getOne();

    const newCategory = {
      ...category,
      processName,
    };

    return await this.processCategoryRepository.save(newCategory);
  }

  async delete({ processCategoryId }) {
    const result = await this.processCategoryRepository.delete({
      processCategoryId,
    });

    return result.affected ? true : false;
  }
}
