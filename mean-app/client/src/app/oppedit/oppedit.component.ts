import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OpportunityService, Opportunity } from '../opportunity.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-oppedit',
  templateUrl: './oppedit.component.html',
  styleUrls: ['./oppedit.component.css']
})

export class OppeditComponent implements OnInit {
  opportunity: any = {};
  profileForm: FormGroup;
  formdata: Opportunity = {
    username: '',
    type: '',
    name: '',
    state: '',
    city: '',
    region: '',
    income: 0,
    move: '',
    principal: 0,
    rate: 0,
    annualCompounds: 0,
    monthlyPayment: 0
  }

  constructor(private activatedRouter: ActivatedRoute,
    private router: Router,
    private oppService: OpportunityService,
    private builder: FormBuilder) {
      this.profileForm = this.builder.group({
        type: ['', Validators.required],
        name: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        region: ['', Validators.required],
        income: [0],
        move: ['', Validators.required],
        principal: [0],
        rate: [0],
        annualCompounds: [0],
        monthlyPayment: [0]
      });
    }

  private updateOpportunity() {
    this.activatedRouter.params.subscribe(params => {
      this.oppService.updateOpportunity(this.formdata, params['id']).subscribe(() => {
        this.router.navigate(['opportunity']);
      }, (err) => {
        console.log(err);
      });
    });
  }

  public onSubmit() {
    this.formdata.type = this.profileForm.value.type;
    this.formdata.name = this.profileForm.value.name;
    this.formdata.city = this.profileForm.value.city;
    this.formdata.state = this.profileForm.value.state;
    this.formdata.region = this.profileForm.value.region;
    this.formdata.income = this.profileForm.value.income;
    this.formdata.move = this.profileForm.value.move;
    this.formdata.principal = this.profileForm.value.principal;
    this.formdata.rate = this.profileForm.value.rate;
    this.formdata.annualCompounds = this.profileForm.value.annualCompounds;
    this.formdata.monthlyPayment = this.profileForm.value.monthlyPayment;
    this.updateOpportunity();
  }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.oppService.editOpportunity(params['id']).subscribe(res => {
        this.opportunity = res;
      });
    });
  }
}
