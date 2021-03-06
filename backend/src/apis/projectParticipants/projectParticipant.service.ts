import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/users.entity';

import {
  PARTICIPANT_POSITION_ENUM,
  ProjectParticipant,
} from './entities/projectParticipant.entity';

@Injectable()
export class ProjectParticipantService {
  constructor(
    @InjectRepository(ProjectParticipant)
    private readonly projectParticipantRepository: Repository<ProjectParticipant>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findParticipatingUser({ projectId }) {
    const participants = await this.projectParticipantRepository
      .createQueryBuilder('projectParticipant')
      .where('projectParticipant.project = :project', { project: projectId })
      .orderBy('projectParticipant.isActivated', 'DESC')
      .addOrderBy('projectParticipant.createdAt', 'ASC')
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user')
      .getMany();

    return participants;
  }

  async findParticipatingProject({ userId }) {
    const projects = await this.projectParticipantRepository
      .createQueryBuilder('projectParticipant')
      .where('projectParticipant.user = :user', { user: userId })
      .orderBy('projectParticipant.createdAt', 'DESC')
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user')
      .getMany();

    return projects;
  }

  async findActivatedProject({ userId }) {
    const projects = await this.projectParticipantRepository
      .createQueryBuilder('projectParticipant')
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user')
      .where('projectParticipant.userUserId = :userId', { userId: userId })
      .andWhere('project.status = :status', { status: true })
      .orderBy('projectParticipant.createdAt', 'DESC')
      .getMany();

    return projects;
  }

  async findInactivatedProject({ userId, standard }) {
    let projects: any;
    projects = this.projectParticipantRepository
      .createQueryBuilder('projectParticipant')
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user')
      .where('projectParticipant.user = :user', { user: userId })
      .andWhere('project.status = :status', { status: false });

    if (standard === '?????????') {
      projects = await projects
        .orderBy('projectParticipant.createdAt', 'DESC')
        .getMany();
    } else if (standard === '?????????') {
      projects = await projects
        .orderBy('projectParticipant.createdAt', 'ASC')
        .getMany();
    }

    return projects;
  }

  async create({ email, projectId }) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (!user) throw new BadRequestException('????????? ????????????!');

    const project = await this.projectRepository.findOne({
      where: { projectId: projectId },
    });

    const existingParticipant = await this.projectParticipantRepository.findOne(
      {
        where: { user: user.userId, project: project.projectId },
        relations: ['project', 'user'],
      },
    );

    if (existingParticipant)
      throw new BadRequestException('?????? ???????????? ???????????????.');

    if (!project)
      throw new BadRequestException('???????????? ??????????????? ????????????.');

    const participant = await this.projectParticipantRepository.save({
      position: PARTICIPANT_POSITION_ENUM.MEMBER,
      user: user,
      project: project,
    });

    return participant;
  }

  async update({ isActivated, projectParticipantId }) {
    const participant = await this.projectParticipantRepository
      .createQueryBuilder('projectParticipant')
      .where(
        'projectParticipant.projectParticipantId = :projectParticipantId',
        { projectParticipantId },
      )
      .leftJoinAndSelect('projectParticipant.project', 'project')
      .leftJoinAndSelect('projectParticipant.user', 'user')
      .getOne();

    if (!participant)
      throw new BadRequestException(
        '???????????? ???????????? ??? ???????????? ????????? ????????????.',
      );

    const newParticipant = {
      ...participant,
      isActivated,
    };

    return await this.projectParticipantRepository.save(newParticipant);
  }

  // ??????
  async delete({ projectParticipantId }) {
    const result = await this.projectParticipantRepository.delete({
      projectParticipantId,
    });
    return result.affected ? true : false;
  }
}
