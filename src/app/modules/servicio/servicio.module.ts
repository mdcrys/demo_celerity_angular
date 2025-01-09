import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicioRoutingModule } from './servicio-routing.module';
import { ListServicioComponent } from './list-servicio/list-servicio.component';
import { CreateServicioComponent } from './create-servicio/create-servicio.component';
import { UpdateServicioComponent } from './update-servicio/update-servicio.component';
import { DeleteServicioComponent } from './delete-servicio/delete-servicio.component';
import { ServicioComponent } from './servicio.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbModule,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';

@NgModule({
  declarations: [
    ListServicioComponent,
    CreateServicioComponent,
    UpdateServicioComponent,
    DeleteServicioComponent,
    ServicioComponent,
  ],
  imports: [
    CommonModule,
    ServicioRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
    // Añade NgSelectModule a las importaciones
    NgSelectModule,
  ],
})
export class ServicioModule {}
