import { LaudosRemoteService } from '../services/laudos-remote.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { LaudoRemote } from '../models/laudo-remote';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [ LaudosRemoteService]
})
export class Tab1Page  implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<LaudoRemote>();
  displayedColumns = ['_id','nome', 'tipo', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(private laudosRemoteService:LaudosRemoteService){}
  
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
    this.laudosRemoteService.getData('laudos/table')
    .subscribe(res => {
      this.dataSource.data = res as LaudoRemote[];
    })
  }
  
  public redirectToDetails = (id: string) => {
    
  }
  
  public redirectToUpdate = (id: string) => {
    
  }
  
  public redirectToDelete = (id: string) => {
    
  }
  
}
