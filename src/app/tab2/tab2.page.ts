import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Laudo, LaudoDataTableItem} from '../models/laudo';
import { LocalLaudosDatasource } from '../services/local-laudos.datasource';
import { LaudosLocalService} from '../services/laudos-local.service';

export interface listLaudo{
  [id: number]: Laudo
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [ LaudosLocalService]
})
export class Tab2Page  implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // dataSource: LocalLaudosDatasource;
  dataSource = new MatTableDataSource<LaudoDataTableItem>();
  displayedColumns = ['filename', 'nome', 'tipo', 'data_exame', 'status', 'actions'];



  constructor(public laudosLocaisService:LaudosLocalService ){

    // fs.watch("/Users/usuario/Desktop/laudos/laudos-json-teste/", (event, filename) => {
    //   console.log(event,filename)
    // })

  }

  // ngOnInit() {
  //   this.dataSource = new LocalLaudosDatasource(this.paginator, this.sort, this.laudosLocais);
  // }

  ngOnInit() {
    this.getAllLaudos();
  }
  
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  
  public getAllLaudos = () => {
    this.laudosLocaisService.getDataTable().subscribe(res => {
      this.dataSource.data = res as LaudoDataTableItem[];
    })
  }



}
