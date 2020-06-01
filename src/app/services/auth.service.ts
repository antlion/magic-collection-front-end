import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {User} from '../models/user.model';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {AlertComponent} from '../components/alert/alert.component';
import {AlertService} from './alert.service';
import * as jwt_decode from 'jwt-decode';

import { environment } from '../../environments/environment';
import {stringify} from "querystring";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router,
    protected alertService: AlertService
  ) {
  }

  // Sign-up
  signUp(user: User): Observable<any> {
    const api = `${environment.endpoint}/register-user`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Sign-in
  signIn(user: User) {
    return this.http.post<any>(`${environment.endpoint}/signin`, user)
      .subscribe((res: any) => {
        localStorage.setItem('access_token', res.token);
        // tslint:disable-next-line:no-shadowed-variable
        this.getUserProfile(res._id).subscribe((res: any) => {
          this.currentUser = res.msg;
          console.log(this.currentUser);
          this.router.navigate(['home']);
        });
      }, err => {
        this.alertService.error('Unable to log in: ' + stringify(err));
        }
      );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    const authToken = localStorage.getItem('access_token');
    return (authToken !== null) ? true : false;
  }

  doLogout() {
    const removeToken = localStorage.removeItem('access_token');
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }

  // User profile
  getUserProfile(id): Observable<any> {
    const api = `${environment.endpoint}/user-profile/${id}`;
    return this.http.get(api, { headers: this.headers }).pipe(
      map((res: Response) => {
        return res || {};
      }),
      catchError(this.handleError)
    );
  }

  getCurrentUser(){
    return this.currentUser;
  }

  // Error
  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(msg);
    return throwError(msg);
  }

  getDecodedAccessToken(): any {
    try{
      return jwt_decode(this.getToken());
    }
    catch (Error){
      return null;
    }
  }

  isTokenExpired(token?: string): boolean {
    if(!token) token = this.getToken();
    if(!token) return true;

    const date = this.getTokenExpirationDate(token);
    if(date === undefined) return false;
    return !(date.valueOf() > new Date().valueOf());
  }

  getTokenExpirationDate(token: string): Date {
    const decoded = jwt_decode(token);

    if (decoded.exp === undefined) return null;

    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
}
