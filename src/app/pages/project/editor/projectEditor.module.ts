import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {ProjectEditorRoutingModule} from './projectEditor-routing.module';
import {ProjectEditorComponent} from './projectEditor.component';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ProjectEditorRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    ProjectEditorComponent
  ],
  exports: [
    ProjectEditorComponent
  ]
})
export class ProjectEditorModule { }
