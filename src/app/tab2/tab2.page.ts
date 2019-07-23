import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataTableDataSource } from './data-table-datasource';
import * as fs from 'fs';
import { Laudo} from '../laudo';
import { LaudosRemoteService} from '../laudos-remote.service';

export interface listLaudo{
  [id: number]: Laudo
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [ LaudosRemoteService]
})
export class Tab2Page  implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: DataTableDataSource;
  displayedColumns = ['nome', 'tipo', 'data_exame'];



  constructor(private remoteLaudos: LaudosRemoteService){

    fs.watch("/Users/usuario/Desktop/laudos/laudos/", (event, filename) => {
      console.log(event,filename)
    })

  }

  ngOnInit() {
    this.dataSource = new DataTableDataSource(this.paginator, this.sort);
    let files = fs.readdirSync('/Users/usuario/Desktop/laudos/laudos');
    files.forEach(file => {
        let rawData = fs.readFileSync('/Users/usuario/Desktop/laudos/laudos/'+file, "utf8");
        let obj = JSON.parse(rawData);
        const laudo ={
            "nome": obj["paciente"]["nome"],
            "tipo": obj["laudo"]["tipo"],
            "data_exame": obj["data_exame"]
        }
        // this.remoteLaudos.addLaudo(obj).subscribe(laudo => console.log(laudo));
        // var json = JSON.stringify(laudo)
       
    });

    // this.remoteLaudos.getLaudos().subscribe( laudos => console.log(laudos));
  }

}
