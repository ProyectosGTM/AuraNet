import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitoreoRoutingModule } from './monitoreo-routing.module';
import { MonitoreoComponent } from './monitoreo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [MonitoreoComponent],
  imports: [
    CommonModule,
    MonitoreoRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MonitoreoModule { }
