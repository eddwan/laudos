import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { LaudoDataTableItem} from '../models/laudo';
import { LaudosLocalService} from '../services/laudos-local.service';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { Sistema } from '../models/config';
import { ConfigService } from '../services/config.service';
import { LaudosRemoteService } from '../services/laudos-remote.service';

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
    public laudosRemoteService:LaudosRemoteService,
    public laudosLocaisService:LaudosLocalService, 
    public dialog: MatDialog, 
    private router: Router,
    private config: ConfigService){ 
      
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
      this.sistema = this.config.getData("sistema")
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
    
    public getLocalStatusIcon(status:string){
      switch(status){
        case 'remote-printed':
        case 'local-printed':
        return { tip: "Salvo e Impresso", icon: "print", color: "primary"};
        break;
        case 'remote-saved':  
        case 'local-saved':
        case 'remote-error':
        return { tip: "Salvo", icon: "save", color: "primary"};
        break;
        default:
        return { tip: "Editando", icon: "edit", color: "warn"};
        break;
      }
    }
    
    public getRemoteStatusIcon(status:string){
      switch(status){
        case 'remote-printed':
        case 'remote-saved':
        return { tip: "Sincronizado", icon: "cloud_done", color: "primary"}
        break; 
        case 'remote-error':
        return { tip: "Erro do servidor", icon: "error_outline", color: "warn"}
        break; 
        case 'syncing':
        return { tip: "Sincronizando", icon: "cloud_queue", color: "accent"}
        break;
        default:
        return { tip: "Não sincronizado", icon: "cloud_off", color: "accent"}
        break;
      }
    }
    
    public sendLaudo(filename:string){
      let laudo = this.laudosLocaisService.getData(filename)
      if(laudo["_id"]==""){
        delete laudo["_id"]
        this.laudosRemoteService.create("laudo", JSON.stringify(laudo)).subscribe(res => {
          if(res){
            if(res["_id"]){
              laudo["_id"] = res["_id"];
              this.laudosLocaisService.saveData(filename, laudo, this.translateLocalToRemoteStatus(laudo["status"]));
            }
          }else{
            console.error("Ocorreu um erro ao gravar o laudo", res)
          }
        });
      }else{
        console.log("Já existe um laudo remoto! Tentando atualizar dados.")
        laudo["_id"]=laudo["_id"]
        this.laudosRemoteService.update("laudo", JSON.stringify(laudo)).subscribe(res => {
          if(res){
            this.laudosLocaisService.saveData(filename, laudo, this.translateLocalToRemoteStatus(laudo["status"]));
          }else{
            console.log("Não encontrado remoto");
            this.laudosLocaisService.saveData(filename, laudo, "remote-error" );
          }
        })
      }
      this.getAllLaudos();
      
    }
    
    private translateLocalToRemoteStatus(status:string){
      switch(status){
        case "local-saved":
        return "remote-saved"
        break;
        case "local-printed":
        return "remote-printed"
        break;
        default:
        return status;
        break;
      }
    }
    
  }
