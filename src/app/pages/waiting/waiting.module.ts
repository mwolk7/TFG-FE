import { NgModule } from '@angular/core';
import { WaitingComponent } from './waiting.component';
import { ComponentsModule } from '../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {WaitingRoutingModule} from './waiting-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    WaitingRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    WaitingComponent
  ],
  exports: [
    WaitingComponent
  ]
})
export class WaitingModule { }
