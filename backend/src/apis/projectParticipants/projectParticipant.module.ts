import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/users.entity';
import { ProjectParticipant } from './entities/projectParticipant.entity';
import { ProjectParticipantResolver } from './projectParticipant.resolver';
import { ProjectParticipantService } from './projectParticipant.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectParticipant, User, Project])],
  providers: [ProjectParticipantResolver, ProjectParticipantService],
})
export class ProjectParticipantModule {}
