import { Controller, Get, Query, Render } from '@nestjs/common';
import cluster from 'node:cluster';
import { cpus } from 'node:os';
import process from 'node:process';

@Controller()
export class TrialController {
  @Get('/fib')
  public fibonacci(@Query('n') n: number): number {
    if (cluster.isPrimary) {
      cluster.fork();
    } else {
      console.log('CPU Length: ', cpus().length);
      console.log('Is cluster primary?: ', cluster.isPrimary);
      console.log('Process ID', process.pid);
      if (n < 2) {
        return n;
      }
      return this.fibonacci(n - 1) + this.fibonacci(n - 2);
    }
  }

  @Get('/hello')
  public helloWord(): string {
    // if (cluster.isPrimary) {
    //   console.log('I AM PRIMARY!:');
    //   cluster.fork();
    // } else {
    //   console.log('CPU Length: ', cpus().length);
    //   console.log('Is cluster primary?: ', cluster.isPrimary);
    //   console.log('Process ID', process.pid);
    //   return 'Hello World!';
    // }
    return 'Hello World!';
  }

  @Get('/live')
  @Render('live')
  public live(): void {}
}
