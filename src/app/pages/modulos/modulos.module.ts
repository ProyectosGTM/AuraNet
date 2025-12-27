import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModulosRoutingModule } from './modulos-routing.module';
import { ListaModulosComponent } from './lista-modulos/lista-modulos.component';


@NgModule({
  declarations: [ListaModulosComponent],
  imports: [
    CommonModule,
    ModulosRoutingModule
  ]
})
export class ModulosModule { }
