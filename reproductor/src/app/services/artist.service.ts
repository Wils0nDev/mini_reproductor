import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Artist } from '../models/artist';
import { GLOBAL } from './global'
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {


  constructor(private httpCliente : HttpClient, private userService : UserService) { }

  saveArtist(artist : Artist): Observable<Artist>{

    let params : Artist = artist
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userService.getToken() || ''})

    return this.httpCliente.post<Artist>(GLOBAL.url + 'artist-add',params, {headers : headers})
    .pipe(
      catchError(this.messageError)
    )

  }

  getArtist(): Observable<Artist>{

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.userService.getToken() || ''})

    return this.httpCliente.get<Artist>(GLOBAL.url + 'artists/',{headers: headers})
    .pipe(
      catchError(this.messageError)
    )
  }

  messageError(error : HttpErrorResponse){
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
}
