import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface Opportunity {
  type: string;
  oppName: string;
  cityName: string;
  stateName: string;
  oppCost: string;
  oppDebt: string;
  move: string;
  _id: string;
  user: string;
}

@Injectable({
  providedIn: 'root'
})

export class OpportunityService {
  constructor(private http: HttpClient) { }

  public addOpportunity(form: Opportunity) {
    const obj = {
      type: form.type,
      oppName: form.oppName,
      cityName: form.cityName,
      stateName: form.stateName,
      oppCost: form.oppCost,
      oppDebt: form.oppDebt,
      move: form.move,
      user: form.user
    };
    return this.http.post(`/api/opportunity`, obj);
  }

  public getOpportunities(user: string) {
    return this.http.get(`/api/opportunity/${user}`);
  }

  public editOpportunity(id: string) {
    return this.http.get(`/api/edit/${id}`);
  }

  public updateOpportunity(form: Opportunity, id: string) {
    const obj = {
      type: form.type,
      oppName: form.oppName,
      cityName: form.cityName,
      stateName: form.stateName,
      oppCost: form.oppCost,
      oppDebt: form.oppDebt,
      move: form.move
      };
    return this.http.post(`/api/edit/${id}`, obj);
  }

  public deleteOpportunity(user: string, id: string) {
    return this.http.get(`/api/opportunity/delete/${user}/${id}`);
  }

}
