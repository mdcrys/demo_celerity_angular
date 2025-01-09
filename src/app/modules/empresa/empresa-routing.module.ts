import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpresaComponent } from './empresa.component';
import { ListEmpresasComponent } from './list-empresas/list-empresas.component';

const routes: Routes = [
  {
    path: '',
    component: EmpresaComponent,
    children: [
      {
        path: 'listado',
        component: ListEmpresasComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmpresaRoutingModule {}
