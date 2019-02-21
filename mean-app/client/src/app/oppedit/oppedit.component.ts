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
    type: '',
    oppName: '',
    cityName: '',
    stateName: '',
    oppCost: '',
    oppDebt: '',
    move: '',
    _id: '',
    user: '',
    code: ''
  }

  constructor(private activatedRouter: ActivatedRoute,
    private router: Router,
    private oppService: OpportunityService,
    private builder: FormBuilder) {
      this.profileForm = this.builder.group({
        type: ['', Validators.required],
        oppName: ['', Validators.required],
        cityName: ['', Validators.required],
        stateName: ['', Validators.required],
        oppCost: ['', Validators.required],
        oppDebt: ['', Validators.required],
        move: ['', Validators.required],
        code: ['', Validators.required]
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
    this.formdata.oppName = this.profileForm.value.oppName;
    this.formdata.cityName = this.profileForm.value.cityName;
    this.formdata.stateName = this.profileForm.value.stateName;
    this.formdata.oppCost = this.profileForm.value.oppCost;
    this.formdata.oppDebt = this.profileForm.value.oppDebt;
    this.formdata.move = this.profileForm.value.move;
    this.formdata.code = this.profileForm.value.code;
    this.updateOpportunity();
  }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.oppService.editOpportunity(params['id']).subscribe(res => {
        this.opportunity = res;
        this.opportunity.code = '';
        var savedState = this.opportunity.stateName;
        this.opportunity.stateName = '';
        //this.profileForm.value.stateName = this.opportunity.stateName;
        //this.opportunity.stateName = 'KS';
        this.opportunity.stateName = savedState;
      });
    });
  }
}
