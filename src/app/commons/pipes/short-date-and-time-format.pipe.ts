import { Pipe, PipeTransform, LOCALE_ID, Inject } from '@angular/core';
import { formatDate } from '@angular/common';

@Pipe({
    name: 'shortDateAndTimeFormat'
})
export class ShortDateAndTimeFormatPipe implements PipeTransform {

    constructor();
    constructor(@Inject(LOCALE_ID) private localeId?: string) {
        if (!localeId) {
            this.localeId = 'it';
        }
    }

    transform(value: any): any {
        const dateTime = formatDate(value, 'dd/MM/yyyy HH:mm:ss', this.localeId);
        console.log(dateTime);
        return dateTime;
    }

}
