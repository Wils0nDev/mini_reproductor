import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/usert';
import { UserService } from '../../../services/user.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { GLOBAL } from '../../../services/global'
@Component({
  selector: 'wr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public token!: string | null
  public identity!: User
  public messageError!: string | null
  public updateRegister!: FormGroup
  public userUpdate!: User;
  extensions?: string[] | undefined;
  isExcludeExtensions?: boolean;
  mensajeSucces: string | undefined;
  public filesToUpload!: Array<File>
  public url!: string;
  public imagePergil! : string

  constructor(private userService: UserService) {
    this.userUpdate = new User('', '', '', '', '', 'ROLE_USER', '');
    this.extensions = ["png", "jpg", "jpge"]
    this.url = GLOBAL.url;
  }

  ngOnInit(): void {
    this.token = this.userService.getToken();
    this.userUpdate = JSON.parse(this.userService.getIdentity() || '{}');
    if(this.userUpdate.image != 'null'){
      this.imagePergil = GLOBAL.image+this.userUpdate.image
    }else{
      this.imagePergil = '';
    }
    this.formValidate();

  }

  formValidate() {
    this.updateRegister = new FormGroup({
      name: new FormControl(this.userUpdate.name, [
        Validators.required
      ]),
      surname: new FormControl(this.userUpdate.surname, [
        Validators.required
      ]),

      image: new FormControl('', [
        Validators.required,
        RxwebValidators.extension({ extensions: ["png", "jpg", "jpge"] })
      ])

    })

  }

  readFile(fileEvent: any) {
    const file = fileEvent.target.files[0];
    console.log('size', file.size);
    console.log('type', file.type);
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
  onSubmit() {
    this.userUpdate.name = this.updateRegister.value.name
    this.userUpdate.surname = this.updateRegister.value.surname
    //this.userUpdate.image = this.updateRegister.value.image
    this.updateUsers(this.userUpdate)

  }

  updateUsers(user: User) {
    this.userService.updateUser(user)
      .pipe(
        catchError(error => {
          this.messageError = error.message
          return EMPTY;

        })
      ).subscribe(
        (response) => {

          if (response.user) {
            if (this.filesToUpload) {

              this.makeFileRequest(this.url + 'upload-image/' + response.user._id, [], this.filesToUpload)
                .then(
                  (result:any) => {
                    
                    if(response.user) { 
                      response.user.image = result.image 
                      this.imagePergil =  GLOBAL.image + response.user.image;
                    }
                    
                    let user: string | null = JSON.stringify(response.user)
                    localStorage.setItem('identity', JSON.stringify(user))
                    

                  })
            }
          }
          this.mensajeSucces = 'Los datos se actulizaron correctamente'
          this.messageError = ''


        }
      )

  }


}
