import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'escapeHtml'
})
export class EscapeHtmlPipe implements PipeTransform {

  transform(value: any): any {
    if(!value) return value;

    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/%22/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

}
