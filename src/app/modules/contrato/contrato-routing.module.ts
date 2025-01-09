import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContratoComponent } from './contrato.component';
import { ListContratoComponent } from './list-contrato/list-contrato.component';
import { CreateContratoComponent } from './create-contrato/create-contrato.component';

const routes: Routes = [
  {
    path: '',
    component: ContratoComponent,
    children: [
      {
        path: 'listado',
        component: ListContratoComponent,
      },
      {
        path: 'Registrar',
        component: CreateContratoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContratoRoutingModule {}
