import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'integerFormat'
})
export class IntegerFormatPipe implements PipeTransform {

  constructor();
  constructor(@Inject(LOCALE_ID) private localeId?: string){
    if(!localeId){
      this.localeId = 'it';
    }
  }

  transform(value: any, ...args: any[]): any {
    if (value != undefined) return formatNumber(value, this.localeId,'.0-0');
    else return('')
  }

}
