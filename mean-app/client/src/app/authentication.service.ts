import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as Rx from 'rxjs';

export interface TokenPayload {
  password: string;
  username: string;
}

export interface Profile {
  username: string;
  income: number;
  debt: number;
  interest: number;
  payments: number;
  dependents: number;
  rent: number;
  spending: number;
  pets: number;
  smoking: boolean;
  drinking: boolean;
}

export interface PasswordPayload {
  username: string;
  oldPassword: string;
  newPassword: string;
}

export interface UsernamePayload {
  oldUsername: string;
  newUsername: string;
  password: string;
}

interface TokenResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;
  private username: string;
  public invokeEvent: Rx.Subject<any> = new Rx.Subject(); //used to update the navbar

  constructor(private http: HttpClient) {
    this.username = '';
  }

  private saveToken(token: string) {
    localStorage.setItem('debt-calc-token', token);
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
    } else if (this.username !== '') {
      return this.username;
    } else {
      return null;
    }
  }

  public updateProfile(form: Profile) {
    const obj = {
      username: form.username,
      income: form.income,
      debt: form.debt,
      interest: form.interest,
      payments: form.payments,
      dependents: form.dependents,
      rent: form.rent,
      spending: form.spending,
      pets: form.pets,
      smoking: form.smoking,
      drinking: form.drinking
    };
    return this.http.post(`/api/personal`, obj);
  }

  public getProfile(user) {
    return this.http.get(`/api/personal/${user}`);
  }

  // this method calls the "updateLink" method in the navbar component
  public callUpdateLink() {
    this.invokeEvent.next("UpdateLink");
  }
}
