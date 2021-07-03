import { Pipe, PipeTransform } from '@angular/core'
import { environment } from 'src/environments/environment'


@Pipe({
    name: 'envCheck'
  })
  export class EnvCheckPipe implements PipeTransform {
  
    constructor() { }
  
    transform(value: any, envName: string): any {
      return environment[envName] === value
    }
  
  }