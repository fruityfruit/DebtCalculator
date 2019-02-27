import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OpportunityService, Opportunity } from '../opportunity.service';
import { AuthenticationService } from '../authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.css']
})
export class OpportunityComponent implements OnInit {
  username: string;
  opportunities: Opportunity[];
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
  profileForm = this.builder.group({
    type: ['', Validators.required],
    oppName: ['', Validators.required],
    cityName: ['', Validators.required],
    stateName: ['', Validators.required],
    oppCost: ['', Validators.required],
    oppDebt: ['', Validators.required],
    move: ['', Validators.required],
    code: ['']
  });

  constructor(private builder: FormBuilder, private oppService: OpportunityService,
    private authService: AuthenticationService, private router: Router) { }

  onSubmit() {
    this.formdata.type = this.profileForm.value.type;
    this.formdata.oppName = this.profileForm.value.oppName;
    this.formdata.cityName = this.profileForm.value.cityName;
    this.formdata.stateName = this.profileForm.value.stateName;
    this.formdata.oppCost = this.profileForm.value.oppCost;
    this.formdata.oppDebt = this.profileForm.value.oppDebt;
    this.formdata.move = this.profileForm.value.move;
    this.formdata.code = this.profileForm.value.code;
    this.formdata.user = this.username;
    this.oppService.addOpportunity(this.formdata).subscribe(() => {
      this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
        this.opportunities = data['opportunities'];
        this.profileForm.reset();
      });
    }, (err) => {
      console.log(err);
      this.profileForm.reset();
    });
  }

  deleteOpportunity(id: string) {
    this.oppService.deleteOpportunity(this.username, id).subscribe(res => {
      this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
        this.opportunities = data['opportunities'];
      });
    });
  }

  ngOnInit() {
    this.username = this.authService.getUsername();
    if (this.username === null) {
      window.alert("Please fill out the Personal page before accessing this page.");
      this.router.navigateByUrl('/personal');
    } else {
      this.oppService.getOpportunities(this.username).subscribe((data: Opportunity[]) => {
        this.opportunities = data['opportunities'];
      });
    }
  }
}
