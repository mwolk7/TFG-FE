import { NgModule } from '@angular/core';
import { TestRunnerComponent } from './testRunner.component';
import { ComponentsModule } from '../../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {TestRunnerRoutingModule} from './testRunner-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    TestRunnerRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    TestRunnerComponent
  ],
  exports: [
    TestRunnerComponent
  ]
})
export class TestRunnerModule { }
