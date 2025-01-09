import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebitoComponent } from './debito.component';
import { ListDebitoComponent } from './list-debito/list-debito.component';
import { CreateDebitoComponent } from './create-debito/create-debito.component';

const routes: Routes = [
  {
    path: '',
    component: DebitoComponent,
    children: [
      {
        path: 'listado',
        component: ListDebitoComponent,
      },
      {
        path: 'Registrar',
        component: CreateDebitoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DebitoRoutingModule {}
