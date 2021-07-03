import { NgModule } from '@angular/core';
import { ProjectComponent } from './project.component';
import { ComponentsModule } from '../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {ProjectRoutingModule} from './project-routing.module';
import {FormsModule} from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        ProjectRoutingModule,
        NgZorroAntdModule,
        FormsModule
    ],
  declarations: [
    ProjectComponent
  ],
  exports: [
    ProjectComponent
  ]
})
export class ProjectModule { }
