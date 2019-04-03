import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Opportunity {
  username: String;
  type: String;
  name: String;
  state: String;
  city: String;
  region: String;
  income: number;
  move: String;
  principal: number;
  rate: number;
  annualCompounds: number;
  monthlyPayment: number;
}

@Injectable({
  providedIn: 'root'
})

export class OpportunityService {
  constructor(private http: HttpClient) { }

  public addOpportunity(form: Opportunity) {
    const obj = {
      username: form.username,
      type: form.type,
      name: form.name,
      city: form.city,
      state: form.state,
      region: form.region,
      income: form.income,
      move: form.move,
      principal: form.principal,
      rate: form.rate,
      annualCompounds: form.annualCompounds,
      monthlyPayment: form.monthlyPayment
    };
    return this.http.post(`/api/opportunity`, obj);
  }

  public getOpportunities(username: String) {
    return this.http.get(`/api/opportunity/${username}`);
  }

  public editOpportunity(id: String) {
    return this.http.get(`/api/opportunity/edit/${id}`);
  }

  public updateOpportunity(form: Opportunity, id: String) {
    const obj = {
      type: form.type,
      name: form.name,
      city: form.city,
      state: form.state,
      region: form.region,
      income: form.income,
      move: form.move,
      principal: form.principal,
      rate: form.rate,
      annualCompounds: form.annualCompounds,
      monthlyPayment: form.monthlyPayment
    };
    return this.http.post(`/api/opportunity/edit/${id}`, obj);
  }

  public deleteOpportunity(username: String, id: String) {
    return this.http.get(`/api/opportunity/delete/${username}/${id}`);
  }

}
