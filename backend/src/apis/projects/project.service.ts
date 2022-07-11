import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { ProjectAddress } from '../projectAddress/entities/projectAddress.entity';
import {
  PARTICIPANT_POSITION_ENUM,
  ProjectParticipant,
} from '../projectParticipants/entities/projectParticipant.entity';
import { User } from '../users/entities/users.entity';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectAddress)
    private readonly projectAddressRepository: Repository<ProjectAddress>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ProjectParticipant)
    private readonly participantRepository: Repository<ProjectParticipant>,
    private readonly connection: Connection,
  ) {}

  async findAll() {
    const projects = await this.projectRepository
      .createQueryBuilder('project')
      .orderBy('project.createAt', 'ASC')
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getMany();
    return projects;
  }

  async findOne({ projectId }) {
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.projectId = :projectId', { projectId })
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getOne();

    if (!project)
      throw new BadRequestException('해당하는 프로젝트가 없습니다.😢');

    return project;
  }

  async create({ createProjectInput, email }) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();

    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      const { projectAddress, ...rest } = createProjectInput;

      // 주소 저장
      const address = this.projectAddressRepository.create({
        ...projectAddress,
      });
      await queryRunner.manager.save(address);

      // 프로젝트 생성
      const project = this.projectRepository.create({
        ...rest,
        email,
        address,
      });

      const saveProject = await queryRunner.manager.save(project);

      // 프로젝트 생성자 이용권 차감
      const user = await queryRunner.manager.findOne(
        User,
        { email },
        { lock: { mode: 'pessimistic_write' } },
      );

      const createProject = this.userRepository.create({
        ...user,
        projectTicket: user.projectTicket - 1,
      });

      const newUser = await queryRunner.manager.save(createProject);

      // 프로젝트 생성자 참여회원 테이블에 leader로 등록
      const projectParticipant = this.participantRepository.create({
        position: PARTICIPANT_POSITION_ENUM.LEADER,
        project: { ...saveProject, address: projectAddress },
        user: newUser,
      });

      await queryRunner.manager.save(projectParticipant);

      await queryRunner.commitTransaction();

      return saveProject;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async update({ projectId, updateProjectInput }) {
    const { projectAddress, ...rest } = updateProjectInput;
    const project = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.projectId = :projectId', { projectId })
      .leftJoinAndSelect('project.address', 'projectAddress')
      .getOne();

    const oldAddress = await this.projectAddressRepository.findOne({
      where: { projectAddressId: project.address.projectAddressId },
    });

    const newAddress = {
      ...oldAddress,
      ...projectAddress,
    };

    const address = await this.projectAddressRepository.save(newAddress);

    const newProject = {
      ...project,
      ...rest,
      address,
    };

    return await this.projectRepository.save(newProject);
  }

  async delete({ projectId }) {
    const result = await this.projectRepository.softDelete({
      projectId: projectId,
    });
    return result.affected ? true : false;
  }
}
