import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) { }

  addOpportunity(form: TokenPayload)
  {

  }
}
