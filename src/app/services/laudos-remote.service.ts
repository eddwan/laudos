import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

const httpOptions ={
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'x-api-key': environment.apiKey
  })
}

@Injectable({
  providedIn: 'root'
})
export class LaudosRemoteService {

  constructor(private http: HttpClient) { }

  public getDataTable = (route: string) => {
    return this.http.get(this.createCompleteRoute(route, environment.apiUrl), httpOptions).pipe(
      map( res => JSON.parse(res["body"]))
    );
  }
 
  public create = (route: string, body) => {
    return this.http.post(this.createCompleteRoute(route, environment.apiUrl), body, httpOptions);
  }
 
  public update = (route: string, body) => {
    return this.http.put(this.createCompleteRoute(route, environment.apiUrl), body, this.generateHeaders());
  }
 
  public delete = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, environment.apiUrl), this.generateHeaders());
  }
 
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
 
  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'x-api-key': environment.apiKey})
    }
  }
}
