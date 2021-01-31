import { Input } from '@angular/core';
import { Component } from '@angular/core';
import { User } from './models/usert';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'wr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Mi reproductor';
  

  @Input()
  register! : RegisterComponent;
  mostrar! : number

  constructor(){
  }

  ngOnInit(): void {
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
