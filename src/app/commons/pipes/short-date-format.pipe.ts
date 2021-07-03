import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'shortDateFormat'
})
export class ShortDateFormatPipe implements PipeTransform {

  constructor();
  constructor(@Inject(LOCALE_ID) private localeId?: string){
    if(!localeId){
      this.localeId = 'it';
    }
  }

  transform(value: any): any {
    if (value) return formatDate(value, 'dd/MM/yyyy', this.localeId)
    else return ''
  }

}

