import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ComponentsModule } from '../../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {DashboardRoutingModule} from './dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    DashboardRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule { }
