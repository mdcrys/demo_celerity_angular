import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DebitoRoutingModule } from './debito-routing.module';
import { DebitoComponent } from './debito.component';
import { CreateDebitoComponent } from './create-debito/create-debito.component';
import { UpdateDebitoComponent } from './update-debito/update-debito.component';
import { DeleteDebitoComponent } from './delete-debito/delete-debito.component';
import { ListDebitoComponent } from './list-debito/list-debito.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbModule,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PdfDebitoComponent } from './pdf-debito/pdf-debito.component';

@NgModule({
  declarations: [
    DebitoComponent,
    CreateDebitoComponent,
    UpdateDebitoComponent,
    DeleteDebitoComponent,
    ListDebitoComponent,
    PdfDebitoComponent,
  ],
  imports: [
    CommonModule,
    DebitoRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ],
})
export class DebitoModule {}
