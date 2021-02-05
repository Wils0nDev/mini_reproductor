import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { User } from './models/usert';
import { RegisterComponent } from './register/register.component';
import { UserService } from './services/user.service';
import {  Router } from '@angular/router';


@Component({
  selector: 'wr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mi reproductor';
  public identity!: string | null;
  public token!: string | null;
  

  @Input()
  register! : RegisterComponent;
  mostrar! : number

  constructor(private userService: UserService, private router: Router){
  }

  ngOnInit(): void {
    if(this.userService.getIdentity()?.length != undefined){
      this.identity = this.userService.getIdentity();
    }else{
      this.identity = null;

    }
    this.token = this.userService.getToken();
  }

  mostrarRegistro() {
    this.mostrar = 1;
    return this.mostrar
  }

  mostrarLogin() {
    this.mostrar = 0;
    return this.mostrar
  }

  cerrarSesion(){
    this.userService.logout()
  }

}
