import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginregisterComponent } from './loginregister/loginregister.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  
  {
    path : 'login',
    component : LoginregisterComponent
    
  },

  {
    path: 'user',
    //lazy loading: renderizando nuestros componentes
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
  {
    path: 'music',
    loadChildren: () => import('./music/music.module').then(m => m.MusicModule)
  }  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
