import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  private request(method: 'post'|'get', type: 'signin'|'register'|'profile', user?: TokenPayload) {
    let base;

    if (method === 'post') {
      base = this.http.post(`/api/${type}`, user);
    } else {
      base = this.http.get(`/api/${type}`);
    }
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
    return this.request('post', 'register', user);
  }

  public signin(user: TokenPayload) {
    return this.request('post', 'signin', user);
  }

  public signout() {
    this.token = '';
    this.username = '';
    window.localStorage.removeItem('debt-calc-token');
    window.localStorage.removeItem('debt-calc-username');
  }

  public isSignedIn() {
    if (window.localStorage.getItem('debt-calc-token')) {
      return true;
    }
    return false;
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
}
