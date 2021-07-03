import { NgModule } from '@angular/core';
import { ErrorComponent } from './error.component';
import { ComponentsModule } from '../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {ErrorRoutingModule} from './error-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ErrorRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    ErrorComponent
  ],
  exports: [
    ErrorComponent
  ]
})
export class ErrorModule { }
