import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  return {
    secret: process.env.JWT_SECRET,
    // TODO: Check best practices for aud and iss naming
    audience: 'Authalo-client',
    issuer: 'Authalo-server',
    accessTokenTtl: 3600,
  };
});
