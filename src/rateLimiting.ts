import { ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard } from "@nestjs/throttler";

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
      ip= client.headers['x-forwarded-for'];
    
    const ttls = await this.storageService.getRecord(ip);

    if (ttls.length >= limit) {
      throw new ThrottlerException("Multiple request detected");
    }

    await this.storageService.addRecord(ip, ttl);
     return true;
  }
}



