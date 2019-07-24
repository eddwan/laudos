import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, combineLatest } from 'rxjs';
import * as fs from 'fs';
import { LaudosLocalService } from './laudos-local.service';
import { LaudoDataTableItem } from '../models/laudo';

export class LocalLaudosDatasource extends DataSource<LaudoDataTableItem> {
    data: LaudoDataTableItem[] = [];
    
    constructor(private paginator: MatPaginator, private sort: MatSort, private laudosLocais: LaudosLocalService) {
        super();
        
        // this.data = this.laudosLocais.getDataTable();
    }

    connect(): Observable<LaudoDataTableItem[]> {
        
        const dataMutations = [
            observableOf(this.data),
            this.paginator.page,
            this.sort.sortChange
        ];
        
        this.paginator.length = this.data.length;
        
        return merge(...dataMutations).pipe(map((t) => {
            console.log(t)
            return this.getPagedData(this.getSortedData([...this.data]));
        }));
    }
    
    disconnect() {}

    private getPagedData(data: LaudoDataTableItem[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }
    
    private getSortedData(data: LaudoDataTableItem[]) {
        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }
        
        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                case 'nome': return compare(a.nome, b.nome, isAsc);
                case 'tipo': return compare(+a.tipo, +b.tipo, isAsc);
                case 'data_exame': return compare(+a.data_exame, +b.data_exame, isAsc);
                case 'status': return compare(+a.status, +b.status, isAsc);
                default: return 0;
            }
        });
    }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}