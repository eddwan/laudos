import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, combineLatest } from 'rxjs';
import * as fs from 'fs';

// TODO: Replace this with your own data model type
export interface DataTableItem {
    nome: string;
    tipo: string;
    data_exame: string;
}

/**
* Data source for the DataTable view. This class should
* encapsulate all logic for fetching and manipulating the displayed data
* (including sorting, pagination, and filtering).
*/
export class DataTableDataSource extends DataSource<DataTableItem> {
    data: DataTableItem[] = [];
    
    constructor(private paginator: MatPaginator, private sort: MatSort) {
        super();
        
        let files = fs.readdirSync('/Users/usuario/Desktop/laudos/laudos-json-teste');
        
        files.forEach(file => {
            console.log(file);
            let rawData = fs.readFileSync('/Users/usuario/Desktop/laudos/laudos-json-teste/'+file, "utf8");
            let obj = JSON.parse(rawData);
            const laudo ={
                "nome": obj["paciente"]["nome"],
                "tipo": obj["laudo"]["tipo"],
                "data_exame": obj["data_exame"],
                "status": obj["status"]
            }
            this.data.push(laudo)
        });
    }
    
    /**
    * Connect this data source to the table. The table will only update when
    * the returned stream emits new items.
    * @returns A stream of the items to be rendered.
    */
    connect(): Observable<DataTableItem[]> {
        
        // Combine everything that affects the rendered data into one update
        // stream for the data-table to consume.
        const dataMutations = [
            observableOf(this.data),
            this.paginator.page,
            this.sort.sortChange
        ];
        
        // Set the paginators length
        this.paginator.length = this.data.length;
        
        return merge(...dataMutations).pipe(map((t) => {
            console.log(t)
            return this.getPagedData(this.getSortedData([...this.data]));
        }));
    }
    
    /**
    *  Called when the table is being destroyed. Use this function, to clean up
    * any open connections or free any held resources that were set up during connect.
    */
    disconnect() {}
    
    /**
    * Paginate the data (client-side). If you're using server-side pagination,
    * this would be replaced by requesting the appropriate data from the server.
    */
    private getPagedData(data: DataTableItem[]) {
        const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
        return data.splice(startIndex, this.paginator.pageSize);
    }
    
    /**
    * Sort the data (client-side). If you're using server-side sorting,
    * this would be replaced by requesting the appropriate data from the server.
    */
    private getSortedData(data: DataTableItem[]) {
        if (!this.sort.active || this.sort.direction === '') {
            return data;
        }
        
        return data.sort((a, b) => {
            const isAsc = this.sort.direction === 'asc';
            switch (this.sort.active) {
                case 'nome': return compare(a.nome, b.nome, isAsc);
                case 'tipo': return compare(+a.tipo, +b.tipo, isAsc);
                case 'data_exame': return compare(+a.data_exame, +b.data_exame, isAsc);
                default: return 0;
            }
        });
    }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}