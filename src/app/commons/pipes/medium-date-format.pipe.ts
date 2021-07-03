import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
  name: 'mediumDateFormat'
})
export class MediumDateFormatPipe implements PipeTransform {

  constructor();
  constructor(@Inject(LOCALE_ID) private localeId?: string) {
    if (!localeId) {
      this.localeId = 'it';
    }
  }

  transform(value: any): any {
    return formatDate(value, 'd MMM y', this.localeId);
  }

}

