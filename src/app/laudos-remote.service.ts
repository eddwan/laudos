import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Laudo, listLaudo } from './laudo';
import { HttpErrorHandler, HandleError } from './http-error-handler.service';

const httpOptions ={
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': 'fcO9PQoK068UNZnmoLnqh8KXfRoZffwY90htd83r'
  })
}

@Injectable({
  providedIn: 'root'
})
export class LaudosRemoteService {
  
  tableUrl = 'https://hlmwkuk8ba.execute-api.us-east-1.amazonaws.com/prod/laudos/table'
  laudosUrl = 'https://hlmwkuk8ba.execute-api.us-east-1.amazonaws.com/prod/laudos'
  laudoUrl = 'https://hlmwkuk8ba.execute-api.us-east-1.amazonaws.com/prod/laudo'
  private handleError: HandleError;
  
  constructor(private http: HttpClient,httpErrorHandler: HttpErrorHandler){
    this.handleError = httpErrorHandler.createHandleError('LaudosRemoteService');
  }
  
  /** GET heroes from the server */
  getLaudos (): Observable<listLaudo[]> {
    return this.http.get<listLaudo[]>(this.laudosUrl, httpOptions)
    .pipe(
      // catchError(this.handleError('getLaudos', []))
      // catchError( console.log('error'))
      );
    }
    
  /** GET heroes from the server */
  getTableLaudos (): Observable<listLaudo[]> {
    return this.http.get<listLaudo[]>(this.tableUrl, httpOptions)
    .pipe(
      // catchError(this.handleError('getLaudos', []))
      // catchError( console.log('error'))
      );
    }
    //////// Save methods //////////
    
    /** POST: add a new hero to the database */
    addLaudo (laudo: Laudo): Observable<Laudo> {
      return this.http.post<Laudo>(this.laudoUrl, laudo, httpOptions)
      .pipe(
        // catchError(this.handleError('addLaudo', laudo))
        );
      }
    }
