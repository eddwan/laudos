import { LaudosRemoteService } from '../services/laudos-remote.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LaudoRemote } from '../models/laudo-remote';
import { LaudosLocalService } from '../services/laudos-local.service';
import * as uuid from 'uuid';
import { SyncServices } from '../services/sync.services';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [ LaudosRemoteService]
})
export class Tab1Page  implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource<LaudoRemote>();
  displayedColumns = ['_id','nome', 'tipo', 'data_exame', 'actions'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    public dialog: MatDialog, 
    private syncService:SyncServices,
    private _snackBar: MatSnackBar,
    private laudosRemoteService:LaudosRemoteService, 
    private laudosLocalService:LaudosLocalService){}
    
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
      this.laudosRemoteService.getDataTable('laudos/table')
      .subscribe(res => {
        let teste: LaudoRemote[] = []
        res.forEach(item =>{
          teste.push(<LaudoRemote>{
            _id: item._id,
            nome: item.nome,
            tipo: item.tipo,
            data_exame: new Date(item.data_exame).toLocaleDateString()
          })
        })
        // this.dataSource.data = res as LaudoRemote[];
        this.dataSource.data = teste
      })
      
    }
    
    public syncAllNow(){
      this.getAllLaudos();
      this.syncService.synchronize();
    }
    
    public deleteLaudo(id:string){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '350px',
        data: "Tem certeza que deseja excluir o laudo do servidor? Esta operação excluirá permanentemente todos os dados desse laudo do servidor, incluindo imagens."
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if(result) {
          this.laudosRemoteService.delete("laudo", {_id: id}).subscribe(
            res => {
              console.log(res);
              this.getAllLaudos();
            }
            )
          }
        });
        
        
      }
      
      public downloadLaudo(id:string){
        this.laudosRemoteService.read('laudo', {_id: id}).subscribe(
          res => {
            let isNew = true

            this.laudosLocalService.getDataTable().subscribe(laudos => {
              laudos.forEach( laudo => {
                if(laudo["_id"] === res["_id"]){
                  isNew = false
                  console.log("Not new. Updating local " + laudo["filename"])
                  this.laudosLocalService.saveData(laudo["filename"], res, 'remote-saved')
                }
              });
            });

            
            if(isNew){
              console.log("New file. Creating local")
              res["status"] = "new"
              this.laudosLocalService.saveData(uuid.v4()+".json", res, 'remote-saved')
            }

            this._snackBar.open("Laudo baixado com sucesso!", "Fechar", {
              duration: 3000,
            });
          }
          )
        }
        
        public redirectToDelete = (id: string) => {
          
        }
        
      }
