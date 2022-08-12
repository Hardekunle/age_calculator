import { createParamDecorator, ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard } from "@nestjs/throttler";



@Injectable()
export class ThrottlerBehindProxyGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): string {
    console.log("the request ip is "+ req.ip);
    
    return req.ips.length ? req.ips[0] : req.ip; // individualize IP extraction to meet your own needs
  }
}

Injectable()
export class WsThrottlerGuard extends ThrottlerGuard {
  async handleRequest(
    context: ExecutionContext,
    limit: number,
    ttl: number,
  ): Promise<boolean> {
    const client = context.switchToHttp().getRequest();
    let ip= client.ip;
    if(client.headers['x-forwarded-for'])
        ip= client.headers['x-forwarded-for']
    
   console.log(ip);
   //const key = this.generateKey(context, ip);
   const ttls = await this.storageService.getRecord(ip);

    if (ttls.length > limit) {
      throw new ThrottlerException();
    }

    await this.storageService.addRecord(ip, ttl);
    return true;
  }
}