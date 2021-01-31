import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { User } from '../models/usert';
import { ValidacionesPersonlizadas } from '../utils/validaciones-personlizadas'

@Component({
  selector: 'wr-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user!: User;
  public identity!: string;
  public token!: string;

  loginForms!: FormGroup

 

  pattern = [
    `(?=([^a-z]*[a-z])\{1},\})`,
    `(?=([^A-Z]*[A-Z])\{1},\})`,
    `(?=([^0-9]*[0-9])\{1},\})`,
    `[A-Za-z\\d\$\@\$\!\%\*\?\&\.]{8},}`
  ]
    .map(item => item.toString())
    .join("");

  passwordProhibidos = ['123456', 'querty', '123456789']
  constructor() {
    this.user = new User('', '', '', '', '', 'ROLE_USER', '');

  }
 

  ngOnInit(): void {


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

  get email() { return this.loginForms.get('email'); }
  get password() { return this.loginForms.get('password'); }


  onSubmit() {
    if (this.loginForms.controls.email.status == "INVALID") {
      console.log('invalido')
    } else {
      console.log('valido')

    }

  }



}
