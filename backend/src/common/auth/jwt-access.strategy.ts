import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESSKEY,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    let accessToken = req.headers.authorization;
    accessToken = accessToken.replace('Bearer ', '');

    const isAccessToken = await this.cacheManager.get(
      `accessToken:${accessToken}`,
    );

    if (isAccessToken) throw new BadRequestException('로그인 해주세요!!');

    return {
      name: payload.name,
      id: payload.sub,
      email: payload.email,
    };
  }
}
