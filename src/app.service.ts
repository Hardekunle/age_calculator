import { BadRequestException, Injectable } from '@nestjs/common';


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAgeByDate(date: string): number {
    var dateString= this.getDateString(date);
    var birthDayObj= new Date(dateString);
    var todayObj= new Date();

    if(!Number.isInteger(birthDayObj.getTime())||!Number.isInteger(todayObj.getTime()))
      throw new BadRequestException('provide your date of birth in the format dd/mm/yyyy');

    if(birthDayObj>todayObj)
        throw new BadRequestException('birth date cannot be greater than today');

    return this.getAgeBetweenDates(birthDayObj,todayObj);
    
  }

  private getAgeBetweenDates(startDate: Date, endDate: Date): number{
    var Xday= startDate.getDate();
    var Xmonth= startDate.getMonth();
    var Xyear= startDate.getFullYear();

    var Yday= endDate.getDate();
    var Ymonth=endDate.getMonth();
    var Yyear= endDate.getFullYear();

    var potentialAge= Yyear- Xyear;
    if(Ymonth< Xmonth){
        potentialAge= potentialAge-1;
    }
    else if(Xmonth==Ymonth){
        if(Yday<Xday)
            potentialAge= potentialAge-1;
    }
    return potentialAge;
  }

  private getDateString(date: string): string{
        if(date==null || date=='') 
            throw new BadRequestException('provide a date of birth in the format dd/mm/yyyy');

        var res1= date.split('/');
        if(res1.length !=3)
              throw new BadRequestException('provide your date of birth in the format dd/mm/yyyy');

        return res1[2]+'-'+res1[1]+'-'+res1[0];
  }
}
