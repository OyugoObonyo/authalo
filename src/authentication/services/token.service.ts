import { REFRESH_TOKEN_REPOSITORY_TOKEN } from '@authentication/impl/repositories/repository.tokens';
import {
  RefreshToken,
  TokenPayload,
} from '@authentication/interfaces/token.interfaces';
import { addIntervalToDate } from '@common/helpers/date-time.helpers';
import { BaseRepository } from '@common/interfaces/base-repository.interface';
import jwtConfig from '@configs/jwt.config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { ObjectLiteral } from '@common/interfaces/object-literal';

// TODO: MAKE Token Service more "generic"?
@Injectable()
export class TokenService {
  constructor(
    @Inject(REFRESH_TOKEN_REPOSITORY_TOKEN)
    private readonly refreshTokenRepo: BaseRepository<RefreshToken>,
    // TODO: Generic token parser to not always be tied to jwt tokens and jwtservice
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  // TODO: ObjectLiteral a recommended type?
  async createAccessToken(
    payload: TokenPayload,
    options: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  async createRefreshToken(
    payload: TokenPayload,
    options: JwtSignOptions,
  ): Promise<string> {
    const refreshToken = await this.refreshTokenRepo.create({
      user: { id: payload.sub },
      expiresAt: addIntervalToDate(
        new Date(),
        this.jwtConfiguration.refreshTokenTtl,
      ),
    });
    return this.jwtService.signAsync(
      { ...payload, jti: refreshToken.id },
      options,
    );
  }

  // TODO: add verifieable claims as options arg?
  async verify<T extends ObjectLiteral>(
    token: string,
    options: JwtVerifyOptions,
  ): Promise<T> {
    try {
      return this.jwtService.verifyAsync<T>(token, options);
    } catch (error) {
      throw error;
    }
  }

  async refresh(token: string, options: JwtSignOptions): Promise<string> {
    // TODO: Verify refresh token expiry at token verify level??
    // NOTE: Try catch block here?
    const verifiedToken = await this.verify<TokenPayload>(token, {
      issuer: this.jwtConfiguration.issuer,
    });
    // TODO: Implemented multioption where clauses?
    // TODO: Transaction when getting, updatiug refresh token to ensure atomicity and no race conditions?
    const refreshToken = await this.refreshTokenRepo.getOneBy({
      id: verifiedToken.jti,
      user: { id: verifiedToken.sub },
      isRevoked: false,
    });
    if (!refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    await this.refreshTokenRepo.update(refreshToken.id, { isRevoked: true });
    return this.createRefreshToken({ sub: verifiedToken.sub }, options);
  }
}
