import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { AgregarUsuarioComponent } from './agregar-usuario/agregar-usuario.component';

const routes: Routes = 
[
  { path: '',
    component: ListaUsuariosComponent
  },
  { path: 'agregar-usuario',
    component: AgregarUsuarioComponent
  },
  {
    path: 'editar-usuario/:idUsuario',
    component: AgregarUsuarioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
