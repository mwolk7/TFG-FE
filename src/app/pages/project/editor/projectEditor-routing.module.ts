import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ProjectEditorComponent} from './projectEditor.component';

const routes: Routes = [{ path: '', component: ProjectEditorComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectEditorRoutingModule { }
