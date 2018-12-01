import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OpportunityformService, TokenPayload } from '../opportunityform.service';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {
  //types = ['Graduate School', 'Job'];
  formdata: TokenPayload = {
    form_type: '',
    form_oppName: '',
    form_cityName: '',
    form_oppCost: '',
    form_oppDebt: '',
    form_move: ''
  }

  profileForm = this.fb.group({
    type: [''],
    oppName: ['', Validators.required],
    cityName: [''],
    oppCost: [''],
    oppDebt: [''],
    move: [''],
  });

  addOpportunity(){
    this.os.addOpportunity(this.formdata);
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.profileForm.value);
    this.formdata.form_type = this.profileForm.value.type;
    this.formdata.form_oppName = this.profileForm.value.oppName;
    this.formdata.form_cityName = this.profileForm.value.cityName;
    this.formdata.form_oppCost = this.profileForm.value.oppCost;
    this.formdata.form_oppDebt = this.profileForm.value.oppDebt;
    this.formdata.form_move = this.profileForm.value.move;
    this.addOpportunity();
  }
  constructor(private fb: FormBuilder, private os: OpportunityformService) {  }

  ngOnInit() {
  }

}
