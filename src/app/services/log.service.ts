import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LogService  {
  constructor() { }

  public log(text: any): any {
    console.log(text);
  }
}
