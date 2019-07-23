import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Platform, Events } from '@ionic/angular'
import { ElectronService } from 'ngx-electron'
import { MatPaginator, MatSort } from '@angular/material';
import { MatTableDataSource } from "@angular/material/table";
import {debounceTime, distinctUntilChanged, startWith, tap, delay} from 'rxjs/operators';
import {merge, fromEvent} from "rxjs";
import { LaudoRemote} from '../models/laudo'
import { LaudosService } from '../services/laudos.service'
import { RemoteLaudosDatasource} from '../services/remote-laudos.datasource'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [ LaudosService]
})
export class Tab1Page  implements OnInit, AfterViewInit {
  laudo: LaudoRemote;
  dataSource: RemoteLaudosDatasource;
  displayedColumns = ['_id','nome', 'tipo'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  
  
  constructor(private laudosService:LaudosService){}
  
  ngOnInit () {
    this.dataSource = new RemoteLaudosDatasource(this.laudosService);
    this.dataSource.loadLaudos();
  }
  
  ngAfterViewInit() {
    
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    
    fromEvent(this.input.nativeElement,'keyup')
    .pipe(
      debounceTime(150),
      distinctUntilChanged(),
      tap(() => {
        this.paginator.pageIndex = 0;
        
        this.dataSource.loadLaudos();
      })
      )
      .subscribe();
      
      merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.dataSource.loadLaudos())
        )
        .subscribe();
        
      }
      
    }
