import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  InternalServerErrorException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../users/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import {
  GqlAuthAccessGuard,
  GqlAuthRefreshGuard,
} from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService, //
    private readonly authService: AuthService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @Mutation(() => String)
  async login(
    @Args('email') email: string, //
    @Args('password') password: string,
    @Context() context: any,
  ) {
    const user = await this.userService.findEmailAll({ email });

    if (!email)
      throw new UnprocessableEntityException('존재하지 않는 이메일입니다!!');

    const isAuth = await bcrypt.compare(password, user.password);

    if (!isAuth) throw new UnprocessableEntityException('비밀번호 불일치!!');

    this.authService.setRefreshToken({ res: context.res, user });

    return this.authService.getAccessToken({ user });
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  async logout(@Context() context: any) {
    const accessToken = context.req.headers.authorization.replace(
      'Bearer ',
      '',
    );
    const refreshToken = context.req.headers.cookie.replace(
      'refreshToken=',
      '',
    );

    //accessToken 검증
    const accessDecode: any = jwt.verify(
      accessToken,
      process.env.ACCESSKEY,
      (err: any, decoded: any) => {
        if (err) {
          throw new BadRequestException('access 인증 오류');
        } else {
          return decoded;
        }
      },
    );

    // refreshToken 검증
    const refreshDecode: any = jwt.verify(
      refreshToken,
      process.env.REFRESHKEY,
      (err: any, decoded: any) => {
        if (err) {
          throw new BadRequestException('refresh 인증 오류');
        } else {
          return decoded;
        }
      },
    );

    const date = new Date();
    const time = Number(date.getTime() / 1000);

    const ttlforAccess = Number(accessDecode.exp) - time;
    const ttlforRefresh = Number(refreshDecode.exp) - time;

    try {
      await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
        ttl: Math.floor(ttlforAccess),
      });

      await this.cacheManager.set(
        `refreshToken:${refreshToken}`,
        refreshToken,
        {
          ttl: Math.floor(ttlforRefresh),
        },
      );
    } catch (error) {
      throw new InternalServerErrorException('redis 에러');
    }

    return '로그아웃 완료!';
  }

  @UseGuards(GqlAuthRefreshGuard)
  @Mutation(() => String)
  restoreAccessToken(
    @CurrentUser() currentUser: ICurrentUser, //
  ) {
    return this.authService.getAccessToken({
      user: {
        userId: currentUser.id,
        email: currentUser.email,
        name: currentUser.name,
      },
    });
  }

  @Mutation(() => String)
  async sendTokenPhone(
    @Args('phone') phone: string, //
  ) {
    try {
      const isVaild = this.authService.checkValidationPhone(phone);
      if (isVaild) {
        const token: string = this.authService.getToken();
        await this.authService.sendTokenToSMS(phone, token);

        await this.cacheManager.set(phone, token, { ttl: 180 });
      }
    } catch {
      throw new InternalServerErrorException('인증번호 발송에 실패하였습니다.');
    }
    return '인증 번호 전송 완료';
  }

  @Mutation(() => String)
  async checkedToekn(
    @Args('phone') phone: string, //
    @Args('inputToken') inputToken: string,
  ) {
    const redisToken = await this.cacheManager.get(phone);
    if (!redisToken)
      throw new BadRequestException(
        '입력하신 번호로 발급된 토큰이 존재하지 않습니다.',
      );
    if (redisToken === inputToken) {
      return '휴대폰 인증 완료!👍🏻';
    }
    return '인증번호가 불일치!!😅';
  }

  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => String)
  sendInvitaionEmail(
    @Args({ name: 'email', type: () => [String] }) email: string[], //
  ) {
    this.authService.sendToInvitaionEmail(email);
    return '전송완료';
  }
}
