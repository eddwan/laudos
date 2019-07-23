import {Injectable} from "@angular/core";
import {HttpClient, HttpParams, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import { LaudoRemote } from '../models/laudo';
import { environment } from '../../environments/environment';
import { map } from "rxjs/operators";

const httpOptions ={
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': environment.apiKey
    })
  }

@Injectable()
export class LaudosService {

    constructor(private http:HttpClient) {

    }

    findAllLaudos(): Observable<LaudoRemote[]>{
        return this.http.get<LaudoRemote[]>(environment.apiUrl+'/laudos/table', httpOptions).pipe(
            map(res =>  JSON.parse(res["body"]))
        );
    }

}