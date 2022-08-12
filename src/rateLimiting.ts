import { createParamDecorator, ExecutionContext, Injectable } from "@nestjs/common";
import { ThrottlerException, ThrottlerGuard } from "@nestjs/throttler";
import { Console } from "console";



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
    if(client.headers['x-forwarded-for']) ip= client.headers['x-forwarded-for'];
    
    const ttls = await this.storageService.getRecord(ip);

    console.log(ttls.length);
    console.log(new Date().getTime());
    if(ttls.length+1< limit){
      await this.storageService.addRecord(ip, ttl);
    }
    else if (ttls.length+1 == limit) {
      await this.storageService.addRecord(ip, ttl); //add the final
      Tracker.set(ip, new Date().getTime()+ 3000) //give a tolerance of 1 sec;
    }
    else{
        var delayTime= Tracker.get(ip);
        var currentTime= new Date().getTime();
        if(delayTime > currentTime)
          throw new ThrottlerException("too many request");
        else{
           await this.storageService.addRecord(ip, ttl);
           Tracker.delete(ip);
        }
    }
    return true;
  }
}

export const Tracker= new Map();


