import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'twoCharacters'
})
export class TwoCharactersPipe implements PipeTransform {

  transform(s: string): string {
    if (s == null) {
      return '';
    }

    const sSplit = s.split(' ')

    if ( sSplit.length > 1 ) {
      return sSplit[0].charAt(0) + sSplit[1].charAt(0);
    }

    if (s.length > 1) {
      return s.charAt(0) + s.charAt(1);
    }

    return s.charAt(0);
  }
}
