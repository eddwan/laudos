import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Sistema } from '../models/config';


@Injectable({
  providedIn: 'root'
})
export class LaudosRemoteService {
  sistema:Sistema

  constructor(private http: HttpClient, private configService:ConfigService) { 
    this.sistema = this.configService.getData("sistema")
  }

  public getDataTable = (route: string) => {
    return this.http.get(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), this.generateHeaders()).pipe(
      map( res => JSON.parse(res["body"]))
    );
  }
 
  public read = (route: string, params: any) => {
    return this.http.get<any>(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), {headers: this.generateHeaders().headers, params: params});
  }

  public create = (route: string, body) => {
    return this.http.post(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), body, this.generateHeaders());
  }
 
  public update = (route: string, body) => {
    return this.http.put(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), body, this.generateHeaders());
  }
 
  public delete = (route: string) => {
    return this.http.delete(this.createCompleteRoute(route, this.sistema.cloud.apiUrl), this.generateHeaders());
  }
 
  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
 
  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({'Content-Type': 'application/json', 'x-api-key': this.sistema.cloud.apiKey})
    }
  }
}
