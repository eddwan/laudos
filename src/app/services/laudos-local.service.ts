import { Injectable } from '@angular/core';
import * as fs from 'fs';
import * as path from 'path';
import { LaudoDataTableItem } from '../models/laudo';
import { of } from 'rxjs';
import { ConfigService, ModelosService } from './config.service';
import { Sistema } from '../models/config';

@Injectable({
    providedIn: 'root'
})
export class LaudosLocalService {
    laudosLocaisTable: LaudoDataTableItem[] = [];
    sistema: Sistema

    constructor(private configService: ConfigService, private modelosService:ModelosService) { 
        this.sistema = this.configService.getData("sistema") || {}
    }
    
    public getDataTable(){
        this.sistema = this.configService.getData("sistema") || {}
        this.laudosLocaisTable = [];
        let files = fs.readdirSync(this.sistema.datastore.path);
        files.forEach(file => {
            if(path.extname(file) == ".json"){
                let rawData = fs.readFileSync(this.sistema.datastore.path+file, "utf8");
                let obj = JSON.parse(rawData);
                const laudo ={
                    "filename": file,
                    "nome": obj.paciente.nome,
                    "tipo": obj.laudo.tipo,
                    "data_exame": new Date(obj.paciente.data_exame).toLocaleDateString(),
                    "status": obj.status
                }
                this.laudosLocaisTable.push(laudo)
            }
        });
        return of(this.laudosLocaisTable);
    }
    
    public getData(filename: string) {
        this.sistema = this.configService.getData("sistema") || {}
        let rawData = fs.readFileSync(this.sistema.datastore.path+filename, "utf8");
        return JSON.parse(rawData);
    }

    public getModelo(modelo: string) {
        // let rawData = fs.readFileSync('./'+filename, "utf8");
        // return JSON.parse(rawData);
        return this.modelosService.getModelo(modelo)
    }

    public saveData( filename: string, laudo: any, status: string = "local-saved"){
        this.sistema = this.configService.getData("sistema") || {}
        laudo.status = status;
        fs.writeFile(this.sistema.datastore.path+filename, JSON.stringify(laudo), "utf8", (err) => {
            console.log(err)
        })
    }

    public deleteFile(filename: string){
        try{
            fs.unlinkSync(this.sistema.datastore.path+filename);
        } catch (err){
            console.log(err)
        }
    }
}
