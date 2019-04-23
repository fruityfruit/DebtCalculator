import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";

export interface Opportunity {
  username: String;
  type: String;
  name: String;
  state: String;
  city: String;
  region: String;
  income: number;
  bonus: number;
  move: String;
}

export interface ShortOpportunity {
  _id: String;
  name: String;
}

@Injectable({
  providedIn: "root"
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
      bonus: form.bonus,
      move: form.move
    };
    return this.http.post(`/api/opportunity`, obj);
  }

  public getOpportunities(username: String) {
    return this.http.get(`/api/opportunity/${username}`);
  }

  public getShortOpps(username: String) {
    return this.http.get(`/api/opportunity/short/${username}`);
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
      bonus: form.bonus,
      move: form.move
    };
    return this.http.post(`/api/opportunity/edit/${id}`, obj);
  }

  public deleteOpportunity(username: String, id: String) {
    return this.http.get(`/api/opportunity/delete/${username}/${id}`);
  }

}
