import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArtistComponent } from './components/artist/artist.component';
import { MusicComponent } from './music.component';

const routes: Routes = [
  {
    path : '',
    component: MusicComponent,
    children:[
      {
        path: 'artist',
        component: ArtistComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MusicRoutingModule { }
