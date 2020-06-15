import { Injectable } from '@angular/core';
import Auth from '@aws-amplify/auth';
import { Hub } from '@aws-amplify/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user.interface';

const initialAuthState = {
  isLoggedIn: false,
  username: null,
  id: null,
  email: null,
  phone_number: null,
  name: null, 
  picture: null,
  'custom:specialty': null
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _authState = new BehaviorSubject<User>(
    initialAuthState
  );

  /** AuthState as an Observable */
  readonly auth$ = this._authState.asObservable();

  /** Observe the isLoggedIn slice of the auth state */
  readonly isLoggedIn$ = this.auth$.pipe(map(state => state.isLoggedIn));

  constructor() {
    // Get the user on creation of this service
    Auth.currentAuthenticatedUser().then(
      (user: any) => this.setUser(user),
      _err => this._authState.next(initialAuthState)
    );

    // Use Hub channel 'auth' to get notified on changes
    Hub.listen('auth', ({ payload: { event, data, message } }) => {
      if (event === 'signIn') {
        // On 'signIn' event, the data is a CognitoUser object
        this.setUser(data);
      } else {
        this._authState.next(initialAuthState);
      }
    });
  }

  private setUser(user: any) {
    if (!user) {
      return;
    }

    user.attributes.isLoggedIn = true
    this._authState.next(user.attributes);
  }
}