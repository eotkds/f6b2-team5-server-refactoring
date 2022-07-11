import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .getMany();
    return users;
  }

  async findOne({ userId }) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.userId = :userId', { userId: userId })
      .getOne();
    return user;
  }

  async findEmail({ email }) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getOne();
    return user;
  }

  async findEmailAll({ email }) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: email })
      .getOne();

    if (!user) throw new BadRequestException('일치하는 이메일이 없습니다😢');
    return user;
  }

  async create({ createUserInput }) {
    const { email, ...rest } = createUserInput;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) throw new BadRequestException('이미 등록된 이메일입니다.');
    return await this.userRepository.save({ ...createUserInput });
  }

  async update({ email, password }) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user)
      throw new BadRequestException('일치하는 이메일이 존재하지 않습니다.');
    const newUser = {
      ...user,
      password,
    };
    return await this.userRepository.save(newUser);
  }

  async updateTicket({ email }) {
    const user = await this.userRepository.findOne({ where: { email } });
    const ticket = user.projectTicket - 1;
    if (!user)
      throw new BadRequestException('일치하는 이메일이 존재하지 않습니다.');
    const newUser = {
      ...user,
      projectTicket: ticket,
    };
    return await this.userRepository.save(newUser);
  }

  async delete({ email }) {
    const result = await this.userRepository.softDelete({ email });
    return result.affected ? true : false;
  }

  // 회원 삭제 복구(만약 신고기능 넣을 시 활용가능할 듯)
  async restore({ userId }) {
    const result = await this.userRepository.restore({ userId });
    return result.affected ? true : false;
  }

  //회원 중 관리자 인지 확인 : 기존 QuestionComment에서 이동
  async checkadmin({ userId }) {
    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });

    return user.admin ? true : new BadRequestException('권한이 없습니다.');
  }

  //user table에서 이름 or 이메일로 검색
  async findAny({ userOremail }) {
    const result = await this.userRepository.query(
      `select * from user where (userName like '%${userOremail}%' or email like '%${userOremail}%')`,
    );

    return result;
  }
}
