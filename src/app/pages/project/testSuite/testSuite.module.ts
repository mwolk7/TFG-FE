import { NgModule } from '@angular/core';
import { TestSuiteComponent } from './testSuite.component';
import { ComponentsModule } from '../../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {TestSuiteRoutingModule} from './testSuite-routing.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    TestSuiteRoutingModule,
    NgZorroAntdModule,
    FormsModule
  ],
  declarations: [
    TestSuiteComponent
  ],
  exports: [
    TestSuiteComponent
  ]
})
export class TestSuiteModule { }
