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
import { MatTable, MatTableDataSource } from '@angular/material/table';
import {MatSort} from '@angular/material/sort';



@Component({
  selector: 'wr-artist',
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css']
})
export class ArtistComponent implements OnInit {

  public dataSource! : Array<any>;
  public artist! : Artist;
  public name! : string
  public addArtistForm!: FormGroup
  @ViewChild(MatTable) tableArtist!: MatTable<Artist>;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [ 'position', 'name', 'description', 'image', 'accion'];
  public imageArtist!: string
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
        //this.dataSource.push(response.artist);
        this.dataSource[0] = new MatTableDataSource(response.artist);
        this.dataSource[0].sort = this.sort;
      }
    )
  }

  
  openDialog(){
    const dialogRef = this.dialog.open(AddComponent, {
      width: '250px',
      data: this.artist
    });

    dialogRef.afterClosed().subscribe(result => {
      this.agregar(result);
    });
  }

  agregar(art: any) {
    if(art){
    this.dataSource[0].data.push(art.artist);
    this.dataSource[0].sort = this.sort;

    }
    
  }

  editarArtist(artist : Artist){
    const dialogRef = this.dialog.open(AddComponent, {
      width: '250px',
      data: artist
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      this.agregar(result);
    });
  }
}

