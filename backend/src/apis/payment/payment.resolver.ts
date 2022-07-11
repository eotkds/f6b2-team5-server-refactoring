import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import { IamportService } from '../iamport/iamport.service';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService, //

    private readonly iamportService: IamportService, //
  ) {}

  //Payment 데이터 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Payment)
  async createPayment(
    @Args('impUid') impUid: string,
    @Args('amount') amount: number,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    //1. 서버에 있는지 먼저 중복 체크
    await this.paymentService.checkDuplicate({ impUid });
    //2. 아임포트에 결제 기록이 있는지 먼저 조회 하기 위해서는 토큰이 필요하다.
    const accessToken = await this.iamportService.getToken();
    //3. 받은 토큰으로 iamport 결제 정보와 DB 결제 정보 대조
    await this.iamportService.checkPaid({ impUid, amount, accessToken });

    return await this.paymentService.create({
      impUid,
      amount,
      currentUser,
      product_name: '1회권',
      accessToken,
    });
  }

  //결제 정보 불러오기(회원으로 검색)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => [Payment])
  fetchPayments(
    @CurrentUser('currentUser') CurrentUser: ICurrentUser, //
    @Args({ name: 'page', type: () => Int, nullable: true })
    page: number, //
  ) {
    return this.paymentService.findAll({ userId: CurrentUser.id, page });
  }

  // 결제정보 한 개만 불러오기(페이징네이션)
  @Query(() => Payment)
  fetchPayment(
    @Args('paymentId') paymentId: string, //
  ) {
    return this.paymentService.findOne({ paymentId });
  }

  // 결제 정보 개수 가져오기(회원으로 검색)
  @UseGuards(GqlAuthAccessGuard)
  @Query(() => Int)
  fetchPaymentsCount(
    @CurrentUser('currentUser') CurrentUser: ICurrentUser, //
  ) {
    return this.paymentService.count({ user: CurrentUser.id });
  }

  //결제 취소 하기 : 현재에는 취소하고 차감할 포인트가 없어서 사용 X
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async cancelPayment(
    @Args('impUid') impUid: string, //
    @CurrentUser('currentUser') currentUser: ICurrentUser, //
  ) {
    //1. impUid로 조회하여 cancel 되었는지 확인
    await this.paymentService.checkAlreadyCanceled({ impUid });
    //2. 취소가능한 포인트를 조회하는 것인데 - 현재 프로젝트와는 성격이 맞지 않는다.
    //기존 무료 프로젝트 1회권을 2개 주기도 하고, 결제한 기록은 있으나,
    //상품을 구매한 기록은 없다.

    //3. 아임포트 취소 요청 시작
    //3-1. 토큰 발행
    const token = await this.iamportService.getToken();
    //3-2. 결제 취소
    const result = await this.iamportService.cancel({ impUid, token });
    //3-3. payment에 취소 등록

    return this.paymentService.cancel({
      impUid: result.imp_uid,
      amount: result.amount,
      currentUser,
    });
  }
}
