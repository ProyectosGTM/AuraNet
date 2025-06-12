import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecargaComponent } from './recarga.component';

const routes: Routes = [
  { 
    path: '',
    component:RecargaComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecargaRoutingModule { }
