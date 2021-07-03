import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestRunnerComponent } from './testRunner.component';

const routes: Routes = [
    { path: '', component: TestRunnerComponent },
    {
        path: ':idTestRunner',
        children: [
            {
                path: '', pathMatch: 'full', redirectTo: 'runner'
            },
            {
                path: 'runner', loadChildren: () => import('./testRunner.module').then(m => m.TestRunnerModule)
            },
            {
                path: 'editor', loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestRunnerRoutingModule { }



