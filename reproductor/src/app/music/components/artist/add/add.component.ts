import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ArtistService } from 'src/app/services/artist.service';
import { UserService } from 'src/app/services/user.service';
import { Artist } from '../../../../models/artist'
import { ArtistComponent } from '../artist.component';
@Component({
  selector: 'wr-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  public addArtistForm!: FormGroup
  public artist! : Artist
  public filesToUpload!: Array<File>
  public extensions?: string[] | undefined;
  public token!: string | null
  public messageError! : string
  public mensajeSucces! : string

  constructor(
    public dialogRef: MatDialogRef<AddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Artist,

    private userService : UserService, 
    private artistService : ArtistService,
    private artistComponent : ArtistComponent
    ) {
     
      this.extensions = ["png", "jpg", "jpge"]
      this.token = this.userService.getToken();

     }

  ngOnInit(): void {
    this.formValidate()
    

  }

  formValidate() {
    this.addArtistForm = new FormGroup({
      name: new FormControl('',[
        RxwebValidators.required()
      ]),
      description: new FormControl('',[
      ]),
      image: new FormControl('', [
        //Validators.required,
        RxwebValidators.extension({ extensions: ["png", "jpg", "jpge"] })
      ])



    })

  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  onSubmit(){
    this.artist = this.addArtistForm.value;
    this.saveArtist(this.artist);
  }

  saveArtist(artist : Artist){

    this.artistService.saveArtist(artist)
    .pipe(
      catchError(error=>{
        this.messageError = error.message
        return EMPTY;
      })
    )
    .subscribe(
      (response)=> {
        this.mensajeSucces = 'Se registro correctamente'
        this.dialogRef.close(response);

        //this.data = response
        //this.artistComponent.ngOnInit()
        //console.log(response)
      },

    )

  }

  filesChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    let token: string = this.token || ''
    return new Promise((resolve, reject) => {
      let formData: any = new FormData();
      let xhr = new XMLHttpRequest();

      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i], files[i].name)
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response))
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', token);
      xhr.send(formData)
    })
  }

}
