import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/users.entity';
import { QuestionBoard } from './entities/questionBoard.entity';

@Injectable()
export class QuestionBoardService {
  constructor(
    @InjectRepository(QuestionBoard)
    private readonly questionBoardRepository: Repository<QuestionBoard>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //QuestionBoard 생성
  async create({ createQuestionBoardInput, currentUser }) {
    const user = await this.userRepository.findOne({
      where: {
        userId: currentUser.id,
      },
    });

    const result = await this.questionBoardRepository.save({
      ...createQuestionBoardInput,
      user: user,
    });

    return result;
  }

  //QuestionBoard 한 개만 조회
  async findOne({ questionBoardId }) {
    return await this.questionBoardRepository.findOne({
      where: { questionBoardId: questionBoardId },
      relations: ['user'],
    });
  }

  //QuestionBoard 전체 조회
  async findAll({ page }) {
    if (!page) {
      return await this.questionBoardRepository
        .createQueryBuilder('QuestionBoard')
        .leftJoinAndSelect('QuestionBoard.user', 'userId')
        .orderBy('QuestionBoard.createAt', 'DESC')
        .getMany();
    }
    if (page) {
      const result = await this.questionBoardRepository
        .createQueryBuilder('QuestionBoard')
        .leftJoinAndSelect('QuestionBoard.user', 'userId')
        .orderBy('QuestionBoard.createAt', 'DESC')
        .skip((page - 1) * 5)
        .take(5)
        .getMany();

      return result;
    }
  }

  //QuestionBoard update
  async update({ questionBoardId, updateQuestionBoardInput }) {
    const IsquestionBoard = await this.questionBoardRepository
      .createQueryBuilder('questionBoard')
      .leftJoinAndSelect('questionBoard.user', 'userId')
      .where('questionBoard.questionBoardId = :questionBoardId', {
        questionBoardId,
      })
      .getOne();

    if (!IsquestionBoard) {
      throw new BadRequestException('해당게시물이 존재하지 않습니다.');
    }

    const newquestionBoard = {
      ...IsquestionBoard,
      ...updateQuestionBoardInput,
    };

    return await this.questionBoardRepository.save(newquestionBoard);
  }
  //QuestionBoard 삭제 : Softdelete
  async delete({ boardId }) {
    const result = await this.questionBoardRepository.softDelete({
      questionBoardId: boardId,
    });
    return result.affected ? true : false;
  }

  //QuestionBoard 개수 조회
  async count() {
    const [results, count] = await this.questionBoardRepository
      .createQueryBuilder('QuestionBoard')
      .leftJoinAndSelect('QuestionBoard.user', 'userId')
      .getManyAndCount();

    return count;
  }
}
