import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  constructor(private http: HttpClient) { }

  getZillowData(user) {
    return this.http.get(`/api/zillow/${user}`);
  }

  getChartsData(user) {
    return this.http.get(`/api/charts/${user}`);
  }
}
