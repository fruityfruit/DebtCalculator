import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OpportunityformService, TokenPayload } from '../opportunityform.service';
//import Opportunity from '../Opportunity';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oppedit',
  templateUrl: './oppedit.component.html',
  styleUrls: ['./oppedit.component.css']
})
export class OppeditComponent implements OnInit {

  opportunity: any = {};
  profileForm: FormGroup;
  formdata: TokenPayload = {
    form_type: '',
    form_oppName: '',
    form_cityName: '',
    form_oppCost: '',
    form_oppDebt: '',
    form_move: ''
  }

  constructor(private route: ActivatedRoute,
    private router: Router,
    private os: OpportunityformService,
    private fb: FormBuilder)
    {
      this.createForm();
    }


  createForm() {
    this.profileForm = this.fb.group({
      type: ['', Validators.required],
      oppName: ['', Validators.required],
      cityName: ['', Validators.required],
      oppCost: ['', Validators.required],
      oppDebt: ['', Validators.required],
      move: ['', Validators.required],
    });
  //  profileForm.oppName.setValue(this.)
  }

  updateOpportunity(){
    this.route.params.subscribe(params => {
      this.os.updateOpportunity(this.formdata, params['id']);
      this.router.navigate(['opportunity']);
    });
  }

  onSubmit() {
    console.log(this.profileForm.value);
    this.formdata.form_type = this.profileForm.value.type;
    this.formdata.form_oppName = this.profileForm.value.oppName;
    this.formdata.form_cityName = this.profileForm.value.cityName;
    this.formdata.form_oppCost = this.profileForm.value.oppCost;
    this.formdata.form_oppDebt = this.profileForm.value.oppDebt;
    this.formdata.form_move = this.profileForm.value.move;
    this.updateOpportunity();
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
        this.os.editOpportunity(params['id']).subscribe(res => {
          this.opportunity = res;
      });
    });
  }
}
