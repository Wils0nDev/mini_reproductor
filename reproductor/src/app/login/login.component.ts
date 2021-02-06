import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../models/usert';
import { ValidacionesPersonlizadas } from '../utils/validaciones-personlizadas'
import { UserService } from '../services/user.service';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component'


@Component({
  selector: 'wr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user!: User;
  public identity!: string | null;
  public token?: string | null;
  mensajeError!: string;
  loginForms!: FormGroup
  textLogin!: string

  constructor(private userService: UserService, private router: Router, private appComponente: AppComponent) {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');

  }

  ngOnInit(): void {

    this.formValidate();
    this.textLogin = "Inciar sesion"

  }

  formValidate() {
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

  //get emails() { return this.loginForms.get('email'); }
  //get password() { return this.loginForms.get('password'); }


  onSubmit() {

    this.user.email = this.loginForms.value.email
    this.user.password = this.loginForms.value.password

    this.textLogin = '...Inciando sesion';
    this.userService.signUp(this.user, false)
      .pipe(
        //tap : para debuggear
        //tap((users: any) => console.log('user',users)),
        //capturamos el error y aplicamos la estrategia de : Catch and Replace : remplazamos el error que queremos mostrar
        catchError(error => {
          this.mensajeError = error.message
          //retornamos un arrafy vacio, esta array se asign ah this.proyectos
          //EMPTY : RETORNA UN OBSERVABLE QUE NO RETORNA NINGUN VALOR
          return EMPTY;
        })
      )
      .subscribe(
        (response) => {
          if (response.user) {

            let identity = {
              _id: response.user._id,
              name: response.user.name,
              surname: response.user.surname,
              email: response.user.email,
              password: '',
              role: response.user.role,
              image: response.user.image,
            }
            this.identity = JSON.stringify(identity);
            if (!identity._id) {
              console.log(' el usuario no se ha podido indetificar')
            } else {
              localStorage.setItem('identity', JSON.stringify(this.identity))
              this.userService.signUp(this.user, true).subscribe(
                (response) => {
                  let token = response.token
                  this.token = token;

                  if (this.token !== undefined) {
                    if (this.token.length <= 0) {
                      alert('El token no se ha podido generar correctamente');
                    } else {
                      localStorage.setItem('token', this.token)
                      this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                      this.appComponente.ngOnInit();
                    }
                  }


                }
              )


            }
          }
        }
      )

  }



}
