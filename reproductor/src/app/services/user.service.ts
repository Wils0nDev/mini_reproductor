import { Injectable } from '@angular/core';
import { Observable, pipe, throwError } from 'rxjs';
import { User } from '../models/usert';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { catchError } from 'rxjs/operators'
@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  mensajeError(error : HttpErrorResponse){
    //instanceof : para capturar errores de lado del cliente
    if(error.error instanceof ErrorEvent){
      console.log('Ocurrio un error en el cliente',error.error.message)
    }else{
      //status : obtenemos el codigo (404,etc), error : obtenemos el mensaje de lado del servidor
      console.log('Error Status :', error.status)
      console.log('Error: ' , error.error);
    }

    //retornamos usando la estrategia de Catch y Rethrow : capturar y reelanzar
    return throwError('Hubo un problema al obtener los datos, intente mas tarde');
    
  }
}
