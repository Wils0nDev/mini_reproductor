import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from 'src/app/models/usert';
import { UserService } from '../../../services/user.service';
import { RxwebValidators } from '@rxweb/reactive-form-validators';

@Component({
  selector: 'wr-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public token!: string | null
  public identity!: User

  public updateRegister!: FormGroup
  public userUpdate!: User;
  extensions?: string[] | undefined;
  isExcludeExtensions?: boolean;
  constructor(private userService: UserService) { 
    this.userUpdate = new User('', '', '', '', '', 'ROLE_USER', '');
    this.extensions = ['png','jpg']

  }

  ngOnInit(): void {
    this.token = this.userService.getToken();
    this.userUpdate = JSON.parse(this.userService.getIdentity() || '{}');
    console.log(this.identity);
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

      image :new FormControl('', [
        Validators.required,
        RxwebValidators.extension({extensions:["png"]})
      ])
      
    })
    
  }

  readFile(fileEvent: any) {
    const file = fileEvent.target.files[0];
    console.log('size', file.size);
    console.log('type', file.type);
 }

  
  onSubmit(){
    console.log(this.updateRegister.value)
  }
}
