import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProcessCategory } from '../processCategory/entities/processCategory.entity';
import { ProjectParticipant } from '../projectParticipants/entities/projectParticipant.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/users.entity';
import { Schedule } from './entities/schedule.entity';
import { ScheduleResolver } from './schedule.resolver';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Schedule, //
      User, //
      Project, //
      ProcessCategory, //
      ProjectParticipant, //
    ]),
  ],
  providers: [
    ScheduleService, //
    ScheduleResolver, //
  ],
})
export class ScheduleModule {}
