import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({
    name: 'enumConverter'
})
export class EnumConverterPipe implements PipeTransform {

    constructor(private translateService: TranslateService) { }

    transform(value: string) {
        return this.translateService.instant('ENUM.' + value.replace('_','.'))
    }

}