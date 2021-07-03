import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './error.component';
import {ProjectComponent} from '../project/project.component';


const routes: Routes = [
        { path: '', component: ErrorComponent },
        { path: ':error', component: ErrorComponent}
    ]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ErrorRoutingModule { }
