import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CancelacionComponent } from './cancelacion.component';
import { ListCancelacionComponent } from './list-cancelacion/list-cancelacion.component';
import { CreateCancelacionComponent } from './create-cancelacion/create-cancelacion.component';

const routes: Routes = [
  {
    path: '',
    component: CancelacionComponent,
    children: [
      {
        path: 'listado',
        component: ListCancelacionComponent,
      },
      {
        path: 'Registrar',
        component: CreateCancelacionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CancelacionRoutingModule {}
