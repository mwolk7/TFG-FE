import { Pipe, PipeTransform } from '@angular/core';
import { EnablingService, EnablingEnum } from '../../services/enabling.service'

@Pipe({
  name: 'enabling'
})
export class EnablingPipe implements PipeTransform {

    constructor(private _enablingService: EnablingService){
    }

    transform(value: string, args?: any): any {
        let enumValue = EnablingEnum[value]
        if(enumValue)
            return this._enablingService.isEnabled(enumValue)
        else {
            console.error("Enum value[" + value + "] isn't correct.")
            return false
        }
    }
}