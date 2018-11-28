import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  profileForm = this.fb.group({
    income: [''],
    debt: [''],
    interest: [''],
    payments: [''],
    dependents: [''],
    rent: [''],
    spending: [''],
    pets: [''],
    smoking: [''],
    drinking: [''],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
