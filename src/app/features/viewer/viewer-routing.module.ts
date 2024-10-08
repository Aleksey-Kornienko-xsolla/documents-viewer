import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewerComponent } from './viewer.component';

const routes: Routes = [
  {
    path: '',
    component: ViewerComponent,
    children: [
      {
        path: ':id',
        loadChildren: () =>
          import('./document/document.module').then(m => m.DocumentModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewerRoutingModule {}
