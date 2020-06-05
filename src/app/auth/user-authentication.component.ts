import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-authentication',
    templateUrl: './user-authentication.component.html',
    styleUrls: ['./user-authentication.component.scss']
})
export class UserAuthenticationComponent implements OnInit {
    
    constructor( private router: Router) {
        
    }
    
    ngOnInit() {

    }
    
}