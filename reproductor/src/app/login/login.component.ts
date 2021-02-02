import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../models/usert';
import { ValidacionesPersonlizadas } from '../utils/validaciones-personlizadas'
import { UserService } from '../services/user.service';
import { EMPTY, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


@Component({
  selector: 'wr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user!: User;
  public identity!: string;
  public token!: string;
  mensajeError! : string;

  loginForms!: FormGroup
  constructor(private userService : UserService) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');

  }
 
  ngOnInit(): void {

    this.formValidate(); 

  }

  formValidate(){
    this.loginForms = new FormGroup({
      email: new FormControl(this.user.email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(this.user.password, Validators.compose([
        Validators.required,
        // check whether the entered password has a number
        ValidacionesPersonlizadas.patternValidator(/\d/, {
          hasNumber: true
        }),
        // check whether the entered password has upper case letter
        ValidacionesPersonlizadas.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        // check whether the entered password has a lower case letter
        ValidacionesPersonlizadas.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        // check whether the entered password has a special character
        ValidacionesPersonlizadas.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        ),
        Validators.minLength(8)
      ])),
    })
  }

  signup(userLogin : User, gethash : any){
    this.userService.signUp(userLogin,gethash)
    .pipe(
      //tap : para debuggear
     //tap((users: any) => console.log('user',users)),
     //capturamos el error y aplicamos la estrategia de : Catch and Replace : remplazamos el error que queremos mostrar
     catchError(error => {
       this.mensajeError = error
       //retornamos un arrafy vacio, esta array se asign ah this.proyectos
       //EMPTY : RETORNA UN OBSERVABLE QUE NO RETORNA NINGUN VALOR
       return EMPTY;
     })
    )
    .subscribe((users:User) => {
      console.log(users)

    })
  }
  //get emails() { return this.loginForms.get('email'); }
  //get password() { return this.loginForms.get('password'); }


  onSubmit() {
    this.user.email = this.loginForms.value.email
    this.user.password = this.loginForms.value.password
    
    this.signup(this.user,true);
  }



}
