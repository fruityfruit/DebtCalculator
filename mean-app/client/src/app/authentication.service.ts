import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as Rx from 'rxjs';
import { Router } from '@angular/router';
import { SnackbaralertService } from './snackbaralert.service';

export interface PasswordPayload {
  username: String;
  oldPassword: String;
  newPassword: String;
}

export interface UsernamePayload {
  oldUsername: String;
  newUsername: String;
  password: String;
}

export interface TokenPayload {
  password: String;
  username: String;
}

interface TokenResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: String;
  private username: String;
  public invokeEvent: Rx.Subject<any> = new Rx.Subject(); //used to update the navbar

  constructor(private http: HttpClient, private router: Router, private alerts: SnackbaralertService) {
    this.username = '';
  }

  private saveToken(token: string) {
    var d = new Date();
    localStorage.setItem('debt-calc-token', (d.getTime()+":"+token));
    this.token = token;
  }

  private saveUsername(username: string) {
    localStorage.setItem('debt-calc-username', username);
    this.username = username;
  }

  // this method makes and handles the post requests required to login and logout a user
  private post(type: 'signin'|'register'|'username'|'password', user) {
    var base = this.http.post(`/api/${type}`, user);
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        if (data.username) {
          this.saveUsername(data.username);
        }
        return data;
      })
    );
    return request;
  }

  public register(user: TokenPayload) {
    return this.post('register', user);
  }

  public signin(user: TokenPayload) {
    return this.post('signin', user);
  }

  public changeUsername(user: UsernamePayload) {
    return this.post('username', user);
  }

  public changePassword(user: PasswordPayload) {
    return this.post('password', user);
  }

  public deleteProfile(user: TokenPayload) {
    return this.http.post(`/api/delete`, user);
  }

  public signout() {
    this.token = '';
    this.username = '';
    window.localStorage.removeItem('debt-calc-token');
    window.localStorage.removeItem('debt-calc-username');
  }

  public getUsername() {
    if (window.localStorage.getItem('debt-calc-username')) {
      return window.localStorage.getItem('debt-calc-username');
    } else {
      return null;
    }
  }

  public isLoggedIn() {
    if (window.localStorage.getItem('debt-calc-token')) {
      var oldTime = window.localStorage.getItem('debt-calc-token');
      oldTime = oldTime.substring(0, oldTime.indexOf(":"));
      var d = new Date();
      var newTime = d.getTime();
      if (newTime - Number(oldTime) > 21600000) { //six hours
        this.signout();
        this.alerts.open('You have been logged out due to inactivity.');
        this.router.navigateByUrl('/home');
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  // this method calls the "updateColor" method in the navbar component
  public callUpdateColor(text: string) {
    this.invokeEvent.next(text);
  }

  public formatMoney(money: number, decimal: boolean) {
    var returnValue = "";
    if (money < 0) {
      money = money * -1;
      returnValue = "-";
    }
    var rounded = String(money.toFixed(2));
    var leadDigits = 0;
    if (rounded.substr(0,rounded.indexOf(".")).length > 3) leadDigits = (rounded.length % 3);
    returnValue = returnValue + "$" + (leadDigits ? rounded.substr(0, leadDigits) + "," : "") + rounded.substr(leadDigits).replace(/(\d{3})(?=\d)/g, "$1" + ",");
    if (!decimal) {
      returnValue = returnValue.substring(0,returnValue.length-3);
    }
    return returnValue;
  }
}
