import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ArtistService } from 'src/app/services/artist.service';
import { AddComponent } from './add/add.component';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Artist } from 'src/app/models/artist';
import { GLOBAL } from 'src/app/services/global';
import { FormControl, FormGroup } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { MatTable } from '@angular/material/table';



@Component({
  selector: 'wr-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  public dataSource: Array<any> = [];
  public artist! : Artist;
  public name! : string
  public addArtistForm!: FormGroup
  @ViewChild(MatTable) tableArtist!: MatTable<Artist>;

  displayedColumns: string[] = [ 'name', 'description', 'image', 'accion'];
  public imageArtist!: string
  animal: any;
  //dataSource = ELEMENT_DATA;
  constructor(public dialog: MatDialog,private artistService : ArtistService ) {
            this.dataSource = [] 
            this.imageArtist = GLOBAL.imageArtist

   }

  ngOnInit(): void {

    this.artistService.getArtist()
    .pipe(
     catchError(error=>{
       console.log(error)
       return EMPTY
     })
    ).subscribe(
      response  => {
        console.log('eweq')
        this.dataSource.push(response.artist)
      }
    )
  }

  
  openDialog(){
    const dialogRef = this.dialog.open(AddComponent, {
      width: '250px',
      data: this.artist
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.agregar(result);
    });
  }

  agregar(art: any) {
    this.dataSource[0].push(art.artist);
    this.tableArtist.renderRows();
  }

}

