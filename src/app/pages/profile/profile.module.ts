import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile.component';
import { ComponentsModule } from '../../components/components.module';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CommonModule } from '@angular/common';
import {ProfileRoutingModule} from './profile-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    ProfileRoutingModule,
    NgZorroAntdModule
  ],
  declarations: [
    ProfileComponent
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
