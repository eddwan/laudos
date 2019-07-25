import { Injectable } from '@angular/core';
import * as fs from 'fs';
import { LaudoDataTableItem, LaudoHisteroscopia } from '../models/laudo';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LaudosLocalService {
    laudosLocaisTable: LaudoDataTableItem[] = [];

    constructor() { }
    
    public getDataTable(){
        this.laudosLocaisTable = [];
        let files = fs.readdirSync('/Users/usuario/Desktop/laudos/laudos-json-teste');
        files.forEach(file => {
            let rawData = fs.readFileSync('/Users/usuario/Desktop/laudos/laudos-json-teste/'+file, "utf8");
            let obj = JSON.parse(rawData);
            const laudo ={
                "filename": file,
                "nome": obj["paciente"]["nome"],
                "tipo": obj["laudo"]["tipo"],
                "data_exame": obj["data_exame"],
                "status": obj["status"]
            }
            this.laudosLocaisTable.push(laudo)
        });
        return of(this.laudosLocaisTable);
    }
    
    public getData(filename: string) {
        let rawData = fs.readFileSync('/Users/usuario/Desktop/laudos/laudos-json-teste/'+filename, "utf8");
        return JSON.parse(rawData);
    }

    public getModelo(filename: string) {
        let rawData = fs.readFileSync('./'+filename, "utf8");
        return JSON.parse(rawData);
    }

    public saveData( filename: string, laudo: LaudoHisteroscopia){
        console.log(filename, laudo);
        fs.writeFile('/Users/usuario/Desktop/laudos/laudos-json-teste/'+filename, JSON.stringify(laudo), "utf8", (err) => {
            console.log(err)
        })
    }
}
