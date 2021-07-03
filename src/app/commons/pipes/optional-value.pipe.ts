import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'optionValue'
})
export class OptionalValuePipe implements PipeTransform {

  transform(value: any, append?: string): any {
    return this.elaborate(value, append);
  }

  private elaborate(value: any, append?: string) {
    if (!value || value === null) {
      return '';
    }
    return `${value}${(append || '')}`;
  }
}

@Pipe({
  name: 'div_100'
})
export class OptionalDivide100Pipe implements PipeTransform {

  transform(value: any): any {
    if (!value) { return value; }
    return value / 100;
  }
}
