import { Pipe, PipeTransform } from '@angular/core'

@Pipe({
    name: 'truncateString'
})
export class TruncateStringPipe implements PipeTransform {

    constructor() { }

    transform(value?: string, maxLength?: number): any {
        return value ? (value.length > maxLength ? `${value.substr(0, maxLength - 3)}...` : value) : ''
    }

}