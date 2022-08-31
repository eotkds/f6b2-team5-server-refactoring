import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: (req) => {
        const refreshToken = req.headers.cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: process.env.REFRESHKEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    let refreshToken = req.headers.cookie;

    refreshToken = refreshToken.replace('refreshToken=', '');
    const isRefreshToken = await this.cacheManager.get(
      `refreshToken:${refreshToken}`,
    );

    if (isRefreshToken) throw new BadRequestException('로그인 해주세요!!');

    return {
      id: payload.sub,
      email: payload.email,
    };
  }
}
