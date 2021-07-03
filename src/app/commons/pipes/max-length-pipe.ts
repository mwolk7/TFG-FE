import { PipeTransform, Pipe } from "@angular/core";

@Pipe({name: 'maxLength'})
export class MaxLengthPipe implements PipeTransform{

  transform(value: any, maxLength: number) {
    if(value && typeof value === 'string'){
      return value.substring(0, maxLength);
    }

    return value;
  }

}
