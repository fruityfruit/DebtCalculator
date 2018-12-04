import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MathService {
  constructor(private http: HttpClient) { }
  sum(){
    //Create a function in math.service.ts that sums;
    //call math.sumDebt();
    this.math.sumDebt().subscribe((data: number)  => console.log(data));
    //.subscribe((data: ));
    //console.log(this.math.sumDebt());
  }
}
