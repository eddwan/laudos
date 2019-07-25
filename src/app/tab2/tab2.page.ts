import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Laudo, LaudoDataTableItem} from '../models/laudo';
import { LocalLaudosDatasource } from '../services/local-laudos.datasource';
import { LaudosLocalService} from '../services/laudos-local.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

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


  constructor(public laudosLocaisService:LaudosLocalService, public dialog: MatDialog){

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

  public editLaudo(filename: string){
    console.log(filename)
  }

  public deleteLaudo(filename: string): void{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: "Tem certeza que deseja excluir o laudo?"
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.laudosLocaisService.deleteFile(filename);
        this.getAllLaudos();
      }
    });

  }


}
