import { Component, OnInit, ViewChild } from '@angular/core'
import { Platform, Events } from '@ionic/angular'
import { ElectronService } from 'ngx-electron'
import { DataService } from '../data.service'
import { LaudoHisteroscopia } from '../laudo';
import { LaudosRemoteService } from '../laudos-remote.service';
import { MatPaginator, MatSort } from '@angular/material';
import { DataTableDataSource } from './data-table-datasource';

export interface listLaudo {
  [id: number] : LaudoHisteroscopia
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [ LaudosRemoteService]
})
export class Tab1Page  implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: listLaudo = [];
  displayedColumns = ['nome', 'tipo', 'data_exame'];

  constructor(private remoteLaudos: LaudosRemoteService){
  }

  ngOnInit () {
    // this.dataSource = new DataTableDataSource(this.paginator, this.sort);
    this.remoteLaudos.getTableLaudos().subscribe( resp => {
      console.log(JSON.parse(resp["body"]))
      this.dataSource = JSON.parse(resp["body"])
    })
  }

}
