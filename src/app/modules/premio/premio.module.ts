import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PremioRoutingModule } from './premio-routing.module';
import { PremioComponent } from './premio.component';


@NgModule({
  declarations: [
    PremioComponent
  ],
  imports: [
    CommonModule,
    PremioRoutingModule
  ]
})
export class PremioModule { }
