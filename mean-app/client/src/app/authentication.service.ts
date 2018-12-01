import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface TokenPayload {
  password: string;
  username: string;
}

interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient) { }

  private saveToken(token: string) {
    localStorage.setItem('debt-calc-token', token);
    this.token = token;
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
    window.localStorage.removeItem('debt-calc-token');
  }

  public isSignedIn() {
    if (window.localStorage.getItem('debt-calc-token')) {
      return true;
    }
    return false;
  }

}
