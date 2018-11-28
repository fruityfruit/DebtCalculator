import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

export interface TokenPayload {
  password: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient, private router: Router) { }

  private request(method: 'post'|'get', type: 'login'|'register'|'profile', user?: TokenPayload) {
    let base;

    if (method === 'post') {
      base = this.http.post(`/api/${type}`, user);
    }
    console.log(base);
    return base;
  }

  public register(user: TokenPayload) {
    return this.request('post', 'register', user);
  }

}
