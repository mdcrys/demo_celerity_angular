import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CancelacionRoutingModule } from './cancelacion-routing.module';
import { CancelacionComponent } from './cancelacion.component';
import { CreateCancelacionComponent } from './create-cancelacion/create-cancelacion.component';
import { EditCancelacionComponent } from './edit-cancelacion/edit-cancelacion.component';
import { ListCancelacionComponent } from './list-cancelacion/list-cancelacion.component';
import { DeleteCancelacionComponent } from './delete-cancelacion/delete-cancelacion.component';
import { PdfCancelacionComponent } from './pdf-cancelacion/pdf-cancelacion.component';
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
    CancelacionComponent,
    CreateCancelacionComponent,
    EditCancelacionComponent,
    ListCancelacionComponent,
    DeleteCancelacionComponent,
    PdfCancelacionComponent,
  ],
  imports: [
    CommonModule,
    CancelacionRoutingModule,

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
export class CancelacionModule {}
