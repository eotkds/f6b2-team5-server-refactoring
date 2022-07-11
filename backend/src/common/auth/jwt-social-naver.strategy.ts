import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';

@Injectable()
export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'https://backend.smaf.shop/naver',
    });
  }

  validate(accessToken: string, resfreshToken: string, profile: any) {
    return {
      email: profile.email,
      password: '1111',
      userName: profile.name,
      phone: profile.mobile,
      userImageURL: 'https://i.ibb.co/PYBhzR8/noprofile.jpg',
    };
  }
}
