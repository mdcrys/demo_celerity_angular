import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicioComponent } from './servicio.component';
import { ListServicioComponent } from './list-servicio/list-servicio.component';

const routes: Routes = [
  {
    path: '',
    component: ServicioComponent,
    children: [
      {
        path: 'listado',
        component: ListServicioComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicioRoutingModule {}
