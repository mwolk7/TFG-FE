import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestSuiteComponent } from './testSuite.component';

const routes: Routes = [
    { path: '', component: TestSuiteComponent },
    {
        path: ':idTestSuite',
        children: [
            {
                path: '', pathMatch: 'full', redirectTo: 'dashboard'
            },
            {
                path: 'dashboard', loadChildren: () => import('./testSuite.module').then(m => m.TestSuiteModule)
            },
            {
                path: 'editor', loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
            },
            {
                path: 'testRunners', loadChildren: () => import('../testRunner/testRunner.module').then(m => m.TestRunnerModule)
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TestSuiteRoutingModule { }



