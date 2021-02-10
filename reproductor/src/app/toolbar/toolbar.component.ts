import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'wr-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Input()
  sidenav! : MatSidenav;
  public menu!: string | null;

  constructor(private userService: UserService, private router : Router) {
   }

  
  ngOnInit(): void {
    if(this.userService.getIdentity()?.length != undefined){
      this.menu = this.userService.getIdentity();
    }else{
      this.menu = null
    }
    console.log(this.menu)

  }

 
  cerrarSesion(){
    this.userService.logout()
    //this.ngOnInit();
    //this.router.navigate(['/'])
  }




}
