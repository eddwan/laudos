import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataTableDataSource } from './data-table-datasource';
import * as fs from 'fs';
import { Laudo} from '../models/laudo';
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
  displayedColumns = ['nome', 'tipo', 'data_exame', 'status', 'actions'];



  constructor(private remoteLaudos: LaudosRemoteService){

    fs.watch("/Users/usuario/Desktop/laudos/laudos-json-teste/", (event, filename) => {
      console.log(event,filename)
    })

  }

  ngOnInit() {
    this.dataSource = new DataTableDataSource(this.paginator, this.sort);
  }

}
