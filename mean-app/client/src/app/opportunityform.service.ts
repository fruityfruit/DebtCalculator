import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

export interface TokenPayload {
  form_type: string;
  form_oppName: string;
  form_cityName: string;
  form_oppCost: string;
  form_oppDebt: string;
  form_move: string;
}

@Injectable({
  providedIn: 'root'
})
export class OpportunityformService {

  constructor(private http: HttpClient) { }

  addOpportunity(form: TokenPayload)
  {
    const obj = {
      type: form.form_type,
      oppName: form.form_oppName,
      cityName: form.form_cityName,
      oppCost: form.form_oppCost,
      oppDebt: form.form_oppDebt,
      move: form.form_move,
    };
    console.log(obj);
    this.http.post(`/api/opportunity`, obj)
    .subscribe(res => console.log('Done'));
  }

  getOpportunities() {
      return this.http.get(`/api/opportunity`);
    }

  editOpportunity(id) {
      return this.http.get(`/api/opportunity/${id}`);
  }

  updateOpportunity(form: TokenPayload, id) {

    const obj = {
      type: form.form_type,
      oppName: form.form_oppName,
      cityName: form.form_cityName,
      oppCost: form.form_oppCost,
      oppDebt: form.form_oppDebt,
      move: form.form_move,
      };
      console.log(obj);
      this.http.post(`/api/opportunity/${id}`, obj)
      .subscribe(res => console.log('Done'));
  }

}
