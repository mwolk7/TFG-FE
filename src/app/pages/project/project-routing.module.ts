import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectComponent } from './project.component';

const routes: Routes = [
    { path: '', component: ProjectComponent },
    {
        path: ':id',
        children: [
            {
                path: '', pathMatch: 'full', redirectTo: 'dashboard'
            },
            {
                path: 'dashboard', loadChildren: () => import('../project/dashboard/dashboard.module').then(m => m.DashboardModule)
            }
            ,
            {
                path: 'testSuites', loadChildren: () => import('../project/testSuite/testSuite.module').then(m => m.TestSuiteModule)
            },
            {
                path: 'editor', loadChildren: () => import('../project/editor/projectEditor.module').then(m => m.ProjectEditorModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProjectRoutingModule { }



