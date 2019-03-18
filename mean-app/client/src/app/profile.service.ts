import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Profile {
  username: String;
  state: String;
  region: String;
  dependents: Number;
  rent: Number;
  spending: Number;
  pets: Number;
}

export interface Debt {
  username: String;
  name: String;
  principal: Number;
  rate: Number;
  annualCompounds: Number;
  monthlyPayment: Number;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  public updateProfile(form: Profile) {
    const obj = {
      username: form.username,
      state: form.state,
      region: form.region,
      dependents: form.dependents,
      rent: form.rent,
      spending: form.spending,
      pets: form.pets
    };
    return this.http.post(`/api/personal`, obj);
  }

  public getProfile(username: String) {
    return this.http.get(`/api/personal/${username}`);
  }

  public createDebt(form: Debt) {
    const obj = {
      username: form.username,
      name: form.name,
      principal: form.principal,
      rate: form.rate,
      annualCompounds: form.annualCompounds,
      monthlyPayment: form.monthlyPayment
    };
    return this.http.post(`/api/debt`, obj);
  }

  public getDebts(username: String) {
    return this.http.get(`/api/debt/${username}`);
  }

  public editDebt(id: String) {
    return this.http.get(`/api/debt/edit/${id}`);
  }

  public updateDebt(form: Debt, id: String) {
    const obj = {
      name: form.name,
      principal: form.principal,
      rate: form.rate,
      annualCompounds: form.annualCompounds,
      monthlyPayment: form.monthlyPayment
    };
    return this.http.post(`/api/debt/edit/${id}`, obj);
  }

  public deleteDebt(username: String, id: String) {
    return this.http.get(`/api/debt/delete/${username}/${id}`);
  }
}
