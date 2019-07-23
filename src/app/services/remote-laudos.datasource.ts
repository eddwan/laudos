import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import { LaudoRemote } from '../models/laudo';
import {catchError, finalize} from "rxjs/operators";
import { LaudosService} from "./laudos.service";

export class RemoteLaudosDatasource implements DataSource<LaudoRemote> {

    private laudosSubject = new BehaviorSubject<LaudoRemote[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    constructor(private laudosService: LaudosService) {

    }

    loadLaudos(){
        this.loadingSubject.next(true);
        this.laudosService.findAllLaudos().pipe(
            catchError( () => of([])),
            finalize( () => this.loadingSubject.next(false))
        )
        .subscribe( laudos => {
            this.laudosSubject.next(laudos);
        })
    }

    connect(collectionViewer: CollectionViewer): Observable<LaudoRemote[]> {
        console.log("Connecting data source");
        return this.laudosSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.laudosSubject.complete();
        this.loadingSubject.complete();
    }

}
