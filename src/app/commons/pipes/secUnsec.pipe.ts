import { PipeTransform, Pipe } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'


@Pipe({
    name: 'secUnsec'
})
export class SecUnsecPipe implements PipeTransform {

    secured: string = this.translateService.instant('DEV.DEFAULT.VALUES.SEC')
    unsecured: string = this.translateService.instant('DEV.DEFAULT.VALUES.UNSEC')

    constructor(private translateService: TranslateService) { }

    transform(value?: boolean): any {
        return typeof (value) !== 'undefined' && value != null ? (value ? this.secured : this.unsecured) : ''
    }

}