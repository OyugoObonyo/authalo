import { ObjectLiteral } from '@common/interfaces/object-literal';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import jwtConfig from '@configs/jwt.config';
import { error } from 'console';

// TODO: MAKE Token Service more "generic"?
@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  // TODO: ObjectLiteral a recommended type?
  async create(
    claims: ObjectLiteral,
    options: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(claims, options);
  }

  async verify(token: string, options: JwtVerifyOptions): Promise<void> {
    try {
      const payload = await this.jwtService.verifyAsync<ObjectLiteral>(
        token,
        options,
      );
      if (payload['issuer'] !== this.jwtConfiguration.issuer) {
        // TODO: How to handle error handling for this
        // TODO: Incorporate checks for audience value
        throw error;
      }
    } catch (error) {
      throw error;
    }
    // validate issuer
    // validate signature
    // validate timestamp& expiry?
  }

  async refresh(): Promise<void> {
    // pull refresh token
    // pull not expired?
    // expired?? unauthorized
    // unexpired?? find refresh token with matching jti
    // revoke found refresh token
    // create new refresh token
    // issue new refresh + access token
  }
}
