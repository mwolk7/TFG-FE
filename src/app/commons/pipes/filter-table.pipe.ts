import { Pipe, PipeTransform, Predicate } from '@angular/core';

@Pipe({
  name: 'filterTable'
})
export class FilterTablePipe implements PipeTransform {

  transform(value: any, args?: any): any {

    if(!value)return null;
    if(!args)return value;

    args = args.toLowerCase();

    // tslint:disable-next-line:only-arrow-functions
    return value.filter(function(item) {
      return JSON.stringify(item).toLowerCase().includes(args);
    });
  }
}
