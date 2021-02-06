import { Injectable } from '@angular/core';
import { Observable,Observer, pipe, throwError } from 'rxjs';
import { User } from '../models/usert';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class UserService {
  public idenitity! : string | null;
  public token! : string | null;

  constructor(private httpClient : HttpClient) { }


  signUp(userLogin : User, gethash:any) : Observable<User> {

      (gethash)  ?    userLogin.gethash = gethash : null;
      
      let json = JSON.stringify(userLogin);
      let params = json;
      let headers = new HttpHeaders({'Content-Type': 'application/json'})

      return this.httpClient.post<User>('http://localhost:3977/api/login',params,{ headers: headers})
      .pipe(
        catchError(this.mensajeError)
      )
  }
  
  onRegister(userRegister : User) : Observable<User>{

    
    let json = JSON.stringify(userRegister);
    let params = json;
    let headers = new HttpHeaders({'Content-Type': 'application/json'})

    return this.httpClient.post<User>('http://localhost:3977/api/add-user',params,{ headers: headers})
      .pipe(
        catchError(this.mensajeError)
      ) 
  }

  updateUser(userUpdate : User) : Observable<User>{

    
    let json = JSON.stringify(userUpdate);
    let params = json;
    let headers  = new HttpHeaders(
      {'Content-Type': 'application/json',
        'Authorization': this.getToken() || ''
       })


    return this.httpClient.put<User>('http://localhost:3977/api/update-user/'+userUpdate._id,params,{ headers: headers})
      .pipe(
        catchError(this.mensajeError)
      ) 
  }

  uploadImage(userUpdate : User) : Observable<User>{

    
    let json = JSON.stringify(userUpdate);
    let params = json;
    let headers  = new HttpHeaders(
      {'Content-Type': 'application/json',
        'Authorization': this.getToken() || ''
    })

    return this.httpClient.put<User>('http://localhost:3977/api/update-user/'+userUpdate._id,params,{ headers: headers})
      .pipe(
        catchError(this.mensajeError)
      ) 
  }

  mensajeError(error : HttpErrorResponse){
    //instanceof : para capturar errores de lado del cliente
    if(error.error instanceof ErrorEvent){
      console.log('Ocurrio un error en el cliente',error.error.message)
    }else{
      //status : obtenemos el codigo (404,etc), error : obtenemos el mensaje de lado del servidor
      //console.log('Error Status :', error.status)
        return throwError(error.error);
      
    }

    //retornamos usando la estrategia de Catch y Rethrow : capturar y reelanzar
    return throwError(error.error);
    
  }
  
  getIdentity(){
    let identity = JSON.parse(localStorage.getItem('identity') || '{}');
    if(identity != 'undefinded'){
      this.idenitity = identity
    }else{
      this.idenitity = null
    }

    return this.idenitity;
  }
    

  getToken() : string | null{

    let token = localStorage.getItem('token');
    if(token != 'undefinded'){
      this.token = token
    }else{
      this.token = null
    }

    return this.token;

  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this.idenitity = null;
    this.token = null;

  }

  
}
