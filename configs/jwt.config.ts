import { registerAs } from '@nestjs/config';

const FIVE_MINUTES = 5 * 3600;
const TEN_MINUTES = 10 * 3600;

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    issuer: 'Authalo',
    accessTokenTtl: FIVE_MINUTES,
    refreshTokenTtl: TEN_MINUTES,
  };
});
