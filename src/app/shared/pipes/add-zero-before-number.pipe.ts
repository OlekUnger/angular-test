import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'addZeroBeforeNumber'
})
export class AddZeroBeforeNumberPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value < 10) {
      return  '0' + value;
    }
    return value;
  }

}
