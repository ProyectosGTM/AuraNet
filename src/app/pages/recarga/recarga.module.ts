import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecargaRoutingModule } from './recarga-routing.module';
import { RecargaComponent } from './recarga.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UIModule } from 'src/app/shared/ui/ui.module';
import { CdkStepperModule } from '@angular/cdk/stepper';
import { NgStepperModule } from 'angular-ng-stepper';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [RecargaComponent],
  imports: [
    CommonModule,
    RecargaRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    UIModule, 
    CdkStepperModule, 
    NgStepperModule,
    NgSelectModule
  ]
})
export class RecargaModule { }
