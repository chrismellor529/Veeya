// import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
// import { Observable } from 'rxjs/Observable';
// import { tokenNotExpired } from 'angular2-jwt';
// import { Router } from '@angular/router';

// import { User } from '../models/User';

// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';

// @Injectable()
// export class AuthService {

//   public authToken: any;
//   public currentUser = new BehaviorSubject<User>(null);
//   public redirecturl: String = '';
//   private user_id: any;

//   constructor(private http: Http, private router: Router) { }

//   registerUser(user) {
//     let route= "http://localhost:3000/register";
//     let headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     delete user.passwordConfirm;
//     let userName = user.userName || (user.firstName + user.lastName);

//     return this.http.post(route, user, { headers: headers })
//       .map((response) => {
//         return response.json();
//       })
//       .catch((error) => {
//         return Observable.throw(error.json());
//       })
//       .subscribe((response) => {
//         this.storeUserData(response.token, response.user.id, response.user.user_type);
//         this.router.navigate(['/dashboard']);
//         this.setCurrentUser(response.user);
//       });
//   }

//   authenticateUser(user) {
//     let route = "http://localhost:3000/login";

//     let headers = new Headers();
//     headers.append('Content-Type', 'application/json');

//     return this.http.post(route, user, { headers: headers })
//       .map((response) => {
//         return response.json();
//       })
//       .catch((error)  => {
//         return Observable.throw(error.json());
//       })
//       .subscribe((response) => {
//         this.storeUserData(response.token, response.user._id, response.user.userType);
//         this.router.navigate(['/dashboard']);
//         this.setCurrentUser(response.user);
//       })
//   }


//   getLoggedInUser() {
//     let userId = this.loggedInUser();
//     let route = `http://localhost:3000/user/${userId}`;
//     return this.http.get(route)
//       .map((response) => {
//         return response.json();
//       })
//       .catch((error) => {
//         return Observable.throw(error.json());
//       })
//   }


//   /* GETTERS */

//   investorUser() {
//     let userType = this.loggedInUserType();
//     return userType === 'Investor' ? true : false;
//   }

//   wholesalerUser() {
//     let userType = this.loggedInUserType();
//     return userType === 'Wholesaler' ? true : false;
//   }

//   loadToken() {
//     const token = this.loggedInUserToken();
//     this.authToken = token;
//   }

//   loggedInUser() {
//     return localStorage.getItem('user_id');
//   }

//   loggedInUserType() {
//     return localStorage.getItem('user_type');
//   }

//   loggedInUserToken() {
//     return localStorage.getItem('id_token');
//   }

//   loggedIn() {
//     return tokenNotExpired('id_token');
//   }

//   getRedirectUrl() {
//     return this.redirecturl;
//   }

//   getCurrentUser() {
//     return this.currentUser.asObservable();
//   }

//   /* SETTERS */

//   setRedirectUrl(url) {
//     this.redirecturl = url;
//   }

//   setCurrentUser(user) {
//     this.currentUser.next(user);
//   }

//   storeUserData(token, user_id, user_type) {
//     localStorage.setItem('id_token', token);
//     localStorage.setItem('user_id', user_id);
//     localStorage.setItem('user_type', user_type);
//     this.authToken = token;
//     this.user_id = user_id;
//   }

//   logout() {
//     this.authToken = null;
//     this.user_id = null;
//     localStorage.clear();
//     this.router.navigate(['/login']);
//   }
// }

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';

import { User } from '../models/User';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/share';

@Injectable()
export class AuthService {

  public authToken: any;
  public currentUser: User;
  private observable: Observable<any>;
  public redirecturl: String = '';
  private user_id: any;

  constructor(private http: Http, private router: Router) { }

  registerUser(user) {
    let route= "http://localhost:3000/register";
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    delete user.passwordConfirm;
    let userName = user.userName || (user.firstName + user.lastName);

    return this.http.post(route, user, { headers: headers })
      .map((response) => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error.json());
      })
      .subscribe((response) => {
        this.storeUserData(response.token, response.user.id, response.user.user_type);
        this.router.navigate(['/dashboard']);
        this.setCurrentUser(response.user);
      });
  }

  authenticateUser(user) {
    let route = "http://localhost:3000/login";

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.post(route, user, { headers: headers })
      .map((response) => {
        return response.json();
      })
      .catch((error)  => {
        return Observable.throw(error.json());
      })
      .subscribe((response) => {
        this.storeUserData(response.token, response.user._id, response.user.userType);
        this.router.navigate(['/dashboard']);
        this.setCurrentUser(response.user);
      })
  }


  getLoggedInUser() {
    let userId = this.loggedInUser();
    let route = `http://localhost:3000/user/${userId}`;
    return this.http.get(route)
      .map((response) => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error.json());
      })
  }


  /* GETTERS */

  investorUser() {
    let userType = this.loggedInUserType();
    return userType === 'Investor' ? true : false;
  }

  wholesalerUser() {
    let userType = this.loggedInUserType();
    return userType === 'Wholesaler' ? true : false;
  }

  loadToken() {
    const token = this.loggedInUserToken();
    this.authToken = token;
  }

  loggedInUser() {
    return localStorage.getItem('user_id');
  }

  loggedInUserType() {
    return localStorage.getItem('user_type');
  }

  loggedInUserToken() {
    return localStorage.getItem('id_token');
  }

  loggedIn() {
    return tokenNotExpired('id_token');
  }

  getRedirectUrl() {
    return this.redirecturl;
  }

  getCurrentUser() {
    if (this.currentUser) {
      return Observable.of(this.currentUser);
    } else if (this.observable) {
      return this.observable;
    } else {
      let userId = this.loggedInUser();
      let route = `http://localhost:3000/user/${userId}`;
      this.observable = this.http.get(route)
        .map((response) => {
          this.observable = null;
          this.currentUser = response.json();
          return this.currentUser;
        })
        .catch((error) => {
          return Observable.throw(error.json());
        })
        .share();
        return this.observable;
    }
  }

  /* SETTERS */

  setRedirectUrl(url) {
    this.redirecturl = url;
  }

  setCurrentUser(user) {
    // this.currentUser.next(user);
  }

  storeUserData(token, user_id, user_type) {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user_id', user_id);
    localStorage.setItem('user_type', user_type);
    this.authToken = token;
    this.user_id = user_id;
  }

  logout() {
    this.authToken = null;
    this.user_id = null;
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}