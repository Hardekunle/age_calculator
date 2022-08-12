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
    var currentTime= new Date().getTime();
    const client = context.switchToHttp().getRequest();
    let ip= client.ip;
    if(client.headers['x-forwarded-for']) 
      ip= client.headers['x-forwarded-for'];
    
    const ttls = await this.storageService.getRecord(ip);

    if(ttls.length+1< limit && !Tracker.has(ip)){
      await this.storageService.addRecord(ip, ttl);
    }
    else if (ttls.length+1 == limit) {
      await this.storageService.addRecord(ip, ttl); //add the final
      var updated= await this.storageService.getRecord(ip);
      Tracker.set(ip, updated[limit-1]) //give a tolerance of 2 sec;
    }
    else{

       
        var delayTime= Tracker.get(ip);
        console.log("target release :"+ delayTime);
        if(delayTime >= currentTime)
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


