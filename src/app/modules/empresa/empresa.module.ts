import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { EmpresaComponent } from './empresa.component';
import { CreateEmpresaComponent } from './create-empresa/create-empresa.component';
import { UpdateEmpresaComponent } from './update-empresa/update-empresa.component';
import { DeleteEmpresaComponent } from './delete-empresa/delete-empresa.component';
import { ListEmpresasComponent } from './list-empresas/list-empresas.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbModule,
  NgbModalModule,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg-2';

@NgModule({
  declarations: [
    EmpresaComponent,
    CreateEmpresaComponent,
    UpdateEmpresaComponent,
    DeleteEmpresaComponent,
    ListEmpresasComponent,
  ],
  imports: [
    CommonModule,
    EmpresaRoutingModule,

    HttpClientModule,
    FormsModule,
    NgbModule,
    ReactiveFormsModule,
    InlineSVGModule,
    NgbModalModule,
    NgbPaginationModule,
  ],
})
export class EmpresaModule {}
