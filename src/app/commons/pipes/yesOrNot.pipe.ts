import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';


@Pipe({
  name: 'yesOrNo'
})
export class YesOrNoPipe implements PipeTransform {

  YES: string = this.translateService.instant('DEV.DEFAULT.VALUES.SI')
  NO: string = this.translateService.instant('DEV.DEFAULT.VALUES.NO')

  constructor(private translateService: TranslateService) { }

  transform(value?: boolean): any {
    return typeof (value) !== 'undefined' && value != null ? (value ? this.YES : this.NO) : ''
  }

}