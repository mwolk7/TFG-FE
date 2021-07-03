import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './commons/roles/roles';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/waiting'
  },
  {
    path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: 'projects', loadChildren: () => import('./pages/project/project.module').then(m => m.ProjectModule)
  }
  ,
  {
    path: 'errors', loadChildren: () => import('./pages/error/error.module').then(m => m.ErrorModule)
  }
  ,
  {
    path: 'waiting', loadChildren: () => import('./pages/waiting/waiting.module').then(m => m.WaitingModule)
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
