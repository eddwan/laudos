import { Component, OnInit } from '@angular/core';
import { Auth, Hub } from 'aws-amplify';
import { Router } from '@angular/router';
import { authStorageService } from '../services/config.service';

@Component({
    selector: 'app-user-authentication',
    templateUrl: './user-authentication.component.html',
    styleUrls: ['./user-authentication.component.scss']
})
export class UserAuthenticationComponent implements OnInit {
    
    constructor( private router: Router) {
        
    }
    
    ngOnInit() {
        Auth.currentAuthenticatedUser().then(user => {
            this.router.navigate(['/'], { replaceUrl: true });
        }).catch( error => console.error(error))
    }
    
}