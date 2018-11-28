import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {
  //types = ['Graduate School', 'Job'];

  profileForm = this.fb.group({
    type: [''],
    oppName: ['', Validators.required],
    cityName: [''],
    oppCost: [''],
    oppDebt: [''],
    move: [''],
  });

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
  }
  constructor(private fb: FormBuilder) {  }

  ngOnInit() {
  }

}
