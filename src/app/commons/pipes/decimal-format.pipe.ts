import { Pipe, PipeTransform, Inject, LOCALE_ID } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
  name: 'decimalFormat'
})
export class DecimalFormatPipe implements PipeTransform {

  constructor();
  constructor(@Inject(LOCALE_ID) private localeId?: string){
    if(!localeId){
      this.localeId = 'it';
    }
  }

  transform(value: any, numDigits?: number): any {
    const defaultDigits = 2
    let nDigits = numDigits ? numDigits : defaultDigits
    if (value != undefined) return formatNumber(value, this.localeId,'.'+nDigits+'-'+nDigits)
    else return('')
  }

}
