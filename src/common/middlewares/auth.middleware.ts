import { NestMiddleware } from '@nestjs/common';


// What does this middleware do?:
// 1. Token validation <Is token valid and not expired?> --> Functional
// 2. Session validation <Is session not blacklisted? Is session not expired?> --> Has dependencies, class
// 3. User validation <Is extracted user not banned?>

// Where and hwo does IP Address extraction and recording fit in?
export class AuthMiddleware implements NestMiddleware 
    use(req: any, res: any, next: (error?: Error | any) => void) {
    use(req: any, res: any, next: (error?: Error | any) => void) {
        throw new Error('Method not implemented.');
    }
        throw new Error("Method not implemented.");
    }
{}
