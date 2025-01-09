import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratoRoutingModule } from './contrato-routing.module';
import { ContratoComponent } from './contrato.component';
import { CreateContratoComponent } from './create-contrato/create-contrato.component';
import { EditContratoComponent } from './edit-contrato/edit-contrato.component';
import { ListContratoComponent } from './list-contrato/list-contrato.component';
import { DeleteContratoComponent } from './delete-contrato/delete-contrato.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbModule,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgSelectModule } from '@ng-select/ng-select';
import { PagosContratoComponent } from './pagos-contrato/pagos-contrato.component';
import { TrasladoContratoComponent } from './traslado-contrato/traslado-contrato.component';
import { VerContratoComponent } from './ver-contrato/ver-contrato.component';
import { CreatePagosContratoComponent } from './create-pagos-contrato/create-pagos-contrato.component';

@NgModule({
  declarations: [
    ContratoComponent,
    CreateContratoComponent,
    EditContratoComponent,
    ListContratoComponent,
    DeleteContratoComponent,
    PagosContratoComponent,
    TrasladoContratoComponent,
    VerContratoComponent,
    CreatePagosContratoComponent,
  ],
  imports: [
    CommonModule,
    ContratoRoutingModule,

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
export class ContratoModule {}
