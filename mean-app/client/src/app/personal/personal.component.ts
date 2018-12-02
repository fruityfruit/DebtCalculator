import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-personal',
  templateUrl: './personal.component.html',
  styleUrls: ['./personal.component.css']
})
export class PersonalComponent implements OnInit {

  profileForm = this.fb.group({
    income: ['', Validators.required],
    debt: ['', Validators.required],
    interest: ['', Validators.required],
    payments: ['', Validators.required],
    dependents: ['', Validators.required],
    rent: ['', Validators.required],
    spending: ['', Validators.required],
    pets: ['', Validators.required],
    smoking: ['', Validators.required],
    drinking: ['', Validators.required],
  });

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }

}
