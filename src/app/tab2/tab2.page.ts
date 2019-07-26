import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Laudo, LaudoDataTableItem} from '../models/laudo';
import { LaudosLocalService} from '../services/laudos-local.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { Sistema } from '../models/config';
import { ConfigService } from '../services/config.service';

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
  dataSource = new MatTableDataSource<LaudoDataTableItem>();
  displayedColumns = ['filename', 'nome', 'tipo', 'data_exame', 'status', 'actions'];
  sistema: Sistema;
  
  constructor(
    public laudosLocaisService:LaudosLocalService, 
    public dialog: MatDialog, 
    private router: Router,
    private config: ConfigService){ 
      this.sistema = this.config.getData("sistema")
    }
    
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
    
    public editLaudo(filename: string, tipo: string){
      switch(tipo){
        case "Histeroscopia":
        this.router.navigate(['/histeroscopia', { filename: filename }]);
        break;
        case "Laparoscopia":
        this.router.navigate(['/laparoscopia', { filename: filename }]);
        break;
      }
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
