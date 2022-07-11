import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { IamportService } from '../iamport/iamport.service';
import { User } from '../users/entities/users.entity';
import {
  Payment,
  PAYMENT_TRANSACTION_STATUS_ENUM,
} from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly iamportService: IamportService,

    private readonly connection: Connection,
  ) {}

  //결제정보 중복 확인
  async checkDuplicate({ impUid }) {
    const result = await this.paymentRepository.findOne({
      where: {
        impUid: impUid,
      },
    });
    if (result)
      throw new BadRequestException('이미 결제가 처리 된 아이디 입니다.');
  }

  //결제정보 생성
  async create({
    impUid,
    amount,
    currentUser,
    status = PAYMENT_TRANSACTION_STATUS_ENUM.PAYMENT,
    product_name,
    accessToken,
  }) {
    //트랜잭션 준비
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction('SERIALIZABLE');

    try {
      //유저정보 업데이트
      const user = await queryRunner.manager.findOne(
        User,
        { userId: currentUser.id },
        { lock: { mode: 'pessimistic_write' } },
      );

      if (!user) throw new BadRequestException('회원이 일치 하지 않습니다.');

      const updateUser = this.userRepository.create({
        ...user,
        projectTicket: user.projectTicket + 1,
      });

      const result = this.paymentRepository.create({
        impUid,
        amount,
        user: user,
        status,
        product_name,
      });

      await queryRunner.manager.save(result);
      await queryRunner.manager.save(updateUser);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      //결제정보 생성 중 에러가 발생할 경우
      //프론트에서 결제를 성공했다는 가정하에 결제 취소 시도
      //결제 취소 없을 경우 아임포트 에러로 마감
      await queryRunner.rollbackTransaction();
      const result = await this.iamportService.cancel({
        impUid,
        token: accessToken,
      });
      //결제정보에 캔슬로 기록
      return this.cancel({
        impUid: result.imp_uid,
        amount: result.amount,
        currentUser,
      });
    } finally {
      await queryRunner.release();
    }
  }

  //결제 정보 조회 - create 에서 pessimistic_write lock이기 때문에 일반 조회
  async findAll({ userId, page }) {
    if (!page) {
      return await this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.user', 'userId')
        .where('payment.user = :userId', { userId })
        .orderBy('payment.createAt', 'DESC')
        .getMany();
    }
    if (page) {
      const result = await this.paymentRepository
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.user', 'userId')
        .where('payment.user = :userId', { userId })
        .orderBy('payment.createAt', 'DESC')
        .skip((page - 1) * 5)
        .take(5)
        .getMany();

      return result;
    }
  }

  // 결제 1건만 찾기
  async findOne({ paymentId }) {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'userId')
      .where('payment.paymentId = :paymentId', { paymentId })
      .getOne();

    return result;
  }

  //결제 수 찾기
  async count({ user }) {
    const [results, count] = await this.paymentRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'userId')
      .where('payment.user = :user', { user: user })
      .getManyAndCount();

    return count;
  }

  //cancel 등록
  async cancel({
    impUid,
    amount,
    product_name = '1회권',
    status = PAYMENT_TRANSACTION_STATUS_ENUM.CANCEL,
    currentUser,
  }) {
    const user = await this.userRepository.findOne({
      where: {
        userId: currentUser.id,
      },
    });
    const result = this.paymentRepository.create({
      impUid,
      amount: -amount,
      product_name,
      status,
      user: user,
    });
    return await this.paymentRepository.save(result);
  }

  //이미 취소된 건인지 확인
  async checkAlreadyCanceled({ impUid }) {
    const result = await this.paymentRepository.findOne({
      where: {
        impUid: impUid,
        status: PAYMENT_TRANSACTION_STATUS_ENUM.CANCEL,
      },
    });
    if (result) throw new BadRequestException('이미 취소된 결제 입니다.');
  }
}
