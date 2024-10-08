import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'viewer',
    loadChildren: () =>
      import('./features/viewer/viewer.module').then(
        module => module.ViewerModule
      ),
  },
  {
    path: '**',
    redirectTo: 'viewer',
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'viewer',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
