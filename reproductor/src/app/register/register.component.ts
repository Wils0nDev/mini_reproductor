import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../models/usert';
import { ValidacionesPersonlizadas } from '../utils/validaciones-personlizadas';
import { UserService } from '../services/user.service';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'wr-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm! : FormGroup;
  register! : User;
  mensajeError!: string;
  mensajeSucces! : string | undefined;

  constructor(private userService : UserService) { 
    this.register = new User('', '', '', '', '', 'ROLE_USER', '');

  }

  ngOnInit(): void {
    this.formValidate();
  }

  formValidate() {
    this.registerForm = new FormGroup({
      name: new FormControl(this.register.name, [
        Validators.required
      ]),
      surname: new FormControl(this.register.surname, [
        Validators.required
      ]),
      email: new FormControl(this.register.email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(this.register.password, Validators.compose([
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

  onSubmit(){
    this.register.name = this.registerForm.value.name
    this.register.surname = this.registerForm.value.surname
    this.register.email = this.registerForm.value.email
    this.register.password = this.registerForm.value.password

    this.onRegister(this.register);
  }


  onRegister(user : User){

    this.userService.onRegister(user)
    .pipe(
        //tap : para debuggear
        //tap((users: any) => console.log('user',users)),
        //capturamos el error y aplicamos la estrategia de : Catch and Replace : remplazamos el error que queremos mostrar
        catchError(error => {
          this.mensajeError = error.message
          this.mensajeSucces = ''
          //retornamos un arrafy vacio, esta array se asign ah this.proyectos
          //EMPTY : RETORNA UN OBSERVABLE QUE NO RETORNA NINGUN VALOR
          return EMPTY;
        })
      ).subscribe(

        (response) =>{

          if(response.status == 200){
            this.mensajeSucces = response.message
            this.mensajeError = ''
            this.register = new User('', '', '', '', '', 'ROLE_USER', '');
            this.registerForm.reset();
          }
        
        }

      )
      
  }
}
