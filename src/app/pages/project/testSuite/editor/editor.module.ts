import { NgModule } from '@angular/core';
import { ComponentsModule } from '../../../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditorComponent} from './editor.component';
import {EditorRoutingModule} from './editor-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ComponentsModule,
        EditorRoutingModule,
        NgZorroAntdModule,
        DragDropModule,
        FormsModule,
        ReactiveFormsModule
    ],
  declarations: [
    EditorComponent
  ],
  exports: [
    EditorComponent
  ]
})
export class EditorModule { }
