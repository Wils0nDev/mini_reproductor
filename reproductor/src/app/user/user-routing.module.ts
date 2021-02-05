import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './components/edit/edit.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { UserComponent } from './user.component';

const routes: Routes = [
  {
    path: '',
    component : UserComponent,
    children : [
      {
        path : 'edit', //manager/add
        component : EditComponent
      },   
      
      {
        path : 'perfil', //manager/add
        component : PerfilComponent
      },  

      {
        path : '', //manager/add
        redirectTo : 'perfil'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
