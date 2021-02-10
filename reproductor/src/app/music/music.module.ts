import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MusicRoutingModule } from './music-routing.module';
import { MusicComponent } from './music.component';
import { ArtistComponent } from './components/artist/artist.component';
import { MaterialModule } from '../material/material.module';
import { AddComponent } from './components/artist/add/add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';


@NgModule({
  declarations: [MusicComponent, ArtistComponent, AddComponent],
  imports: [
    CommonModule,
    MusicRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RxReactiveFormsModule
  ]
})
export class MusicModule { }
