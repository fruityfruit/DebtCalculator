import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OpportunityService, Opportunity } from '../opportunity.service';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {
  username: String;
  opportunities: Opportunity[];
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
  };
  dataSource = new MatTableDataSource(this.opportunities);
  displayedColumns: string[] = ['name', 'city', 'state', 'income', 'edit', 'delete'];

  constructor(private builder: FormBuilder, private oppService: OpportunityService,
    private auth: AuthenticationService, private router: Router) {
    this.profileForm = this.builder.group({
      type: ['', Validators.required],
      name: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      region: ['', ],
      income: [0],
      move: ['', Validators.required],
      principal: [0],
      rate: [0],
      annualCompounds: [0],
      monthlyPayment: [0],
    });
  }
  onSubmit() {
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
    this.formdata.username = this.username;
    this.oppService.addOpportunity(this.formdata).subscribe(() => {
      this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
        this.opportunities = data['opportunities'];
        this.dataSource.data = this.opportunities;
        this.profileForm.reset();
      });
    }, (err) => {
      console.log(err);
      this.profileForm.reset();
    });
  }

  deleteOpportunity(id: String) {
    this.oppService.deleteOpportunity(this.username, id).subscribe(res => {
      this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
        this.opportunities = data['opportunities'];
        this.dataSource.data = this.opportunities;
      });
    });
  }

  ngOnInit() {
    this.username = this.auth.getUsername();
    if (this.username === null) {
      window.alert("Please fill out the Personal page before accessing this page.");
      this.router.navigateByUrl('/personal');
    } else {
      this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
        this.opportunities = data['opportunities'];
        this.dataSource.data = this.opportunities;
      });
    }
  }
}
