import { Component, Input, OnInit } from '@angular/core';
import { RegisterComponent } from '../register/register.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'wr-loginregister',
  templateUrl: './loginregister.component.html',
  styleUrls: ['./loginregister.component.css']
})
export class LoginregisterComponent implements OnInit {
  mostrar! : number
  public identity!: string | null;
  public token!: string | null;

  @Input()
  register! : RegisterComponent;

  constructor(private userService: UserService) { }

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
}
